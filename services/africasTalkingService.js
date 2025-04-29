require("dotenv").config();

const {splitPK, encryptKey, decryptKey} = require("../utils/tool")
const africaStalkingData = require("africastalking");
const { User, Transaction } = require('../models');
const { ethers } = require('ethers');
const { Op } = require('sequelize');


const fs = require('fs');
const { v4: uuid } = require('uuid');
const { sendSMS, messages } = require('./smsService');
const generateSafiriUsername  = require('../utils/usernameGeneration');

const africaStalking = africaStalkingData({
    apiKey: process.env.AFRICA_STALKING_API_KEY || "",
    username: process.env.AFRICA_STALKING_USERNAME || 'sandbox',
});

// Configuration
const provider = process.env.BASE_ETH_PROVIDER_URL || 'https://base-sepolia.g.alchemy.com/v2/9-PIwmEK19yyEu468y65gQSJEIjflXjA';

const ERC20_ABI = [
    "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
    "function transfer(address recipient, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
];

const ethProvider = new ethers.JsonRpcProvider(provider);
const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS;


const ussdAccess = async (req, res) => {
    const {sessionId, serviceCode, phoneNumber, text} = req.body;

    let response; 
    let fullName = '';
    let passcode = '';
    
    if(text == ''){
        response = 'CON Welcome to FundX Wallet \n 1. Create an account \n 2. Check wallet balance \n 3. Transfer'
    }

    else if(text == '1') {
        response = 'CON Enter full name ';
    }

    else if(text == '2') {
        try {
            const userExist = await User.findOne({ where: { phoneNumber } });

            if (!userExist){
                response = 'END You do not have an account. Please create one';
            } else {
               
                if (!userExist.status) {
                    response = 'END Your wallet is not yet active.';
                } else {
                    const tokenContract = await new ethers.Contract(USDT_CONTRACT_ADDRESS, ERC20_ABI, ethProvider);
                    const userAddress = userExist.walletAddress;
        
                    const userBalance = await tokenContract.balanceOf(userAddress);
                    response = `END Your wallet balance: ${Number(userBalance)} USDT`;

                    sendSMS(phoneNumber, messages.accountBalance(userExist.walletAddress, Number(userBalance)));
                }
            }
        } catch (error) {
            response = 'END Could not check balance at the moment';
            console.error("Balance check error:", error);
        }
    }

    else if(text == '3') {
        try {
            const userExist = await User.findOne({ where: { phoneNumber } });
            
            if (!userExist) {
                response = 'END You do not have an account. Please create one';
            } else if (!userExist.status) {
                response = 'END Your wallet is not yet active.';
            } else {
                response = 'CON Enter recipient username or phone number';
            }
        } catch (error) {
            console.error("Transfer initiation error:", error);
            response = 'END Could not initiate transfer';
        }
    }

    // More complex logics
    else if(text !== '') {
        
        let array = text.split('*')

        if(array.length < 1) {
            response = 'END Invalid input';
        }
        
        // Create account option
        if(parseInt(array[0]) == 1){
            console.log(`Registration Array 1: ${array}`)
            if(array.length === 2) {
                if(parseInt(array[0]) == 1) {
                    fullName = array[1]
                    response = 'CON Enter your passcode'
                }
            }
            
            if(array.length === 3) {
                console.log(`Registration Array 2: ${array}`)
                if(parseInt(array[0]) == 1) {
                    fullName = array[1]
                    passcode = array[2]

                    if(!fullName || !phoneNumber || !passcode) {
                        response = 'END Incomplete signup details'
                    }

                    try {
                        const userExist = await User.findOne({ where: { phoneNumber } });
                    
                        console.log("existence of user", userExist)
                    
                        if (userExist) {
                            response = "END You already have an account"; 
                        } else {
                            response = 'END Creating account, you will receive an SMS when complete';
                            
                            const wallet = ethers.Wallet.createRandom();

                            const privateKey = wallet.privateKey;
                            const walletAddress = wallet.address;

                            const [firstHalf] = splitPK(privateKey);

                            const encryptedKey = `${encryptKey(privateKey, firstHalf)}${firstHalf}`;

                            const safiriUsername = await generateSafiriUsername(fullName);
                            
                            const user = await User.create({
                                fullName,
                                phoneNumber,
                                safiriUsername: safiriUsername,
                                walletAddress: walletAddress,
                                privateKey: encryptedKey,
                                pin: passcode,
                                status: true
                            });

                            sendSMS(phoneNumber, messages.accountCreated(walletAddress))
                            console.log('User record created in database');


                        }
                    } catch (error) {
                        response = `END Error: ${error.message || "Unknown error"}`;
                    }
                } 
            }
        }

        // Transfer option
        if(parseInt(array[0]) == 3) {
            if(array.length === 2) {
                const recipientIdentifier = array[1];
                
                try {
                    const recipient = await User.findOne({
                        where: {
                            [Op.or]: [
                                { safiriUsername: recipientIdentifier },
                                { phoneNumber: recipientIdentifier }
                            ],
                            status: true
                        }
                    });

                    if (!recipient) {
                        response = 'END Recipient not found or wallet not active';
                    } else {
                        console.log('Recipient found:', recipient);
                        response = 'CON Enter amount to transfer (USDT) to ' + recipient.fullName;
                    }
                } catch (error) {
                    console.error("Recipient lookup error:", error);
                    response = 'END Could not find recipient';
                }
            }

            
            if(array.length === 3) {
                
                console.log(`TF Amount Array: ${array}`)

                const recipientIdentifier = array[1];
                const amount = array[2];
                
                if (isNaN(amount) || parseFloat(amount) <= 0) {
                    response = 'END Please enter a valid amount';
                } else {
                    response = 'CON Enter your PIN to confirm transfer';
                }
            }
            
            if(array.length === 4) {
                const recipientIdentifier = array[1];
                const amount = array[2];
                const userPin = array[3];
                
                try {
                    const sender = await User.findOne({ where: { phoneNumber } });
                    
                    const recipient = await User.findOne({
                        where: {
                            [Op.or]: [
                                { safiriUsername: recipientIdentifier },
                                { phoneNumber: recipientIdentifier }
                            ],
                            status: true
                        }
                    });
                    
                    if (!sender) {
                        response = 'END You do not have an account';
                    } else if (sender.pin != userPin) {
                        response = 'END Incorrect PIN';
                    } else if (!recipient) {
                        response = 'END Recipient not found or wallet not active';
                    } else if (sender.phoneNumber === recipient.phoneNumber) {
                        response = 'END You cannot transfer to your own account';
                    } else {
                        response = 'END Transfer initiated. You will receive an SMS confirmation.';

                        const privateKey = decryptKey(sender.privateKey);
                        const userWallet = new ethers.Wallet(privateKey, ethProvider);
                        const tokenContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, ERC20_ABI, userWallet);

                        const senderBalance = await tokenContract.balanceOf(sender.walletAddress);

                        if (senderBalance < amount) {
                            response = 'END USDT balance insufficient';
                        }

                        const transfer = await tokenContract.transfer(recipient.walletAddress, amount, {
                            gasLimit: 300000,
                        });
                        await transfer.wait();

                        if (transfer.hash != undefined) {
                            await Transaction.create({
                                user_id: sender.id,
                                txHash: transfer.hash,
                                amount: parseFloat(amount),
                                serviceBeneficiary: recipient.safiriUsername || recipient.phoneNumber,
                                date: new Date()
                            });
                        }

                
                        console.log(transfer.hash);

                        sendSMS(phoneNumber, messages.transactionSuccess(transfer.hash, amount, recipient.safiriUsername));
                        
                    }
                } catch (error) {
                    console.error("Transfer processing error:", error);
                    response = 'END Could not process transfer';
                }
            }
        }
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
}

// Add new function to handle transaction notifications
async function sendTransactionNotification(phoneNumber, success, details) {
    try {
        const message = success 
            ? messages.transactionSuccess(details.txHash, details.amount)
            : messages.transactionFailed(details.error);
            
        await sendSMS(phoneNumber, message);
    } catch (error) {
        console.error('Failed to send transaction notification:', error);
    }
}

module.exports = {
    ussdAccess,
    sendTransactionNotification
};