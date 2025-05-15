require("dotenv").config();
const africaStalkingData = require("africastalking");

const africaStalking = africaStalkingData({
    apiKey: process.env.AFRICA_STALKING_API_KEY || "",
    username: process.env.AFRICA_STALKING_USERNAME || 'sandbox',
});

async function sendSMS(phoneNumber, message) {
    try {
        const result = await africaStalking.SMS.send({
            to: phoneNumber,
            message: message,
            from: `28364`
        });
        console.log('SMS sent successfully:', result);
        return result;
    } catch (error) {
        console.error('SMS sending failed:', error);
        throw error;
    }
}

// Message templates
const messages = {
    accountCreated: (address) => 
        `Your FundX wallet has been created successfully! Your wallet address: ${address}`,
    
    transactionSuccess: (txHash, amount, recipient) =>
        `Transaction successful! Amount: ${amount} USDT. Hash: ${txHash.substring(0, 8)}...\n Recipient: ${recipient}`,
    
    transactionFailed: (error) =>
        `Transaction failed. Error: ${error}. Please try again later.`,
    accountBalance: (address, balance) =>
        `Your account ${address} \n has a balance of ${balance} USDT.`,
};

module.exports = {
    sendSMS,
    messages
}; 