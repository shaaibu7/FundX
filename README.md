# FundX: Bridging Traditional Finance and Blockchain

FundX aims to bridge the gap between traditional financial systems and blockchain by implementing **USSD-based blockchain interactions** and enabling **seamless international fiat transactions**.

Financial inclusion remains a significant challenge in many regions, especially where smartphone and internet penetration is low. Additionally, international payments are slow, costly, and reliant on intermediaries. FundX addresses these issues by:

- Enabling **USSD-based interactions** with blockchain for users without internet access.
- Enabling **international fiat transfers** over the blockchain, allowing users to send funds (e.g., Naira) to recipients in other countries (e.g., Ghana), with the recipient receiving their **local currency** (e.g., Ghanaian Cedi) directly **without an intermediary platform or crypto conversion**.
- Allowing users with **crypto assets** to seamlessly convert them into fiat (native currency) within the FundX ecosystem.

## Problem Statement

1. **Limited blockchain access for non-smartphone users:** Most blockchain solutions require internet and smartphones.  
2. **High cost and inefficiency of international payments:** Traditional remittance services impose high fees and long processing times.  
3. **Crypto to fiat conversion barriers:** Many users face challenges in converting crypto to fiat without centralized exchanges.  

## Technical Solution

### USSD Blockchain Implementation

- **USSD Gateway:** A middleware that interacts with blockchain smart contracts via API requests.   
 

### Crypto to Fiat Conversion

- **On-Chain Swap Mechanism:** Users can swap stablecoins for fiat directly without P2P.  
- **Decentralized Liquidity Pools:** Ensuring seamless conversion of crypto assets to local currency.  
- **Off-Ramp Partners:** Integration with licensed financial institutions to facilitate direct bank withdrawals or mobile money deposits.  

## Architecture Overview

1. **Frontend (USSD Interface):** Users interact via USSD menus.  
2. **Backend (Smart Contracts & Payment Rails):** Executes transactions, maintains liquidity, and ensures compliance.  
3. **Ensuring continuous availability of USSD services.**  

FundX aims to **democratize blockchain access via USSD** while simplifying international fiat transactions. By leveraging **smart contracts** and **financial partnerships**, we provide a **scalable and secure solution** for seamless payments and crypto-to-fiat conversions.

## Running the Safiri Project
**prerequisites**
- Ensure you have the following installed on your system<br>
**Docker**<br>
**Docker Compose (if not included with Docker)**<br>
**Latest version of node**

### 1. Clone the Repository and navigate to FundX dir
```bash
cd ~
git clone https://github.com/shaaibu7/FundX.git
cd FundX
```
### 2.Start Up Docker
```bash
docker compose up
```
### 3. Install the Dependencies
```bash
npm install
```
### 4. Copy the Environment Variables File
```bash
cp .env.example .env
```
Edit the .env file as needed with your configurations.
### 5. Install Dependencies and Start Up Docker
```bash
npm install

docker compose up
```
### 5. Start the Project
```bash
npm run start
```
Now you're ready to start building with FundX. Next is to Create an Account with Africa's Talking[create an account](https://account.africastalking.com/auth/login?next=%2F)


### Africa's Talking APIs for USSD Integration
Africa's Talking's APIs for USSD integration and interactions.
We will be using Africa's Talking’s sandbox and emulator for test development.

- Sandbox: For testing API interactions without affecting live data.

- Emulator: Simulate USSD interactions to test how the system behaves before going live.

### **Setup a sandbox**
#### i. Create a Channel in Your Dashboard
1. Go to your **Africa's Talking dashboard**.
2. Navigate to the **USSD** section.
3. Click on **Create Channel**.
4. Provide your **channel number** and the **callback URL**.

#### ii. Set Up Ngrok
If you don’t have Ngrok installed, follow the official [installation documentation](https://ngrok.com/docs) or run the following command to install it:

```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
   | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
   && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
   | sudo tee /etc/apt/sources.list.d/ngrok.list \
   && sudo apt update \
   && sudo apt install ngrok
   ```

