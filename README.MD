🌊 BlueLedger – Blockchain-Based Blue Carbon Registry & MRV System

Built on Moonbeam
 – the Ethereum-compatible Polkadot parachain for seamless Web3 interoperability.

🪙 Overview

BlueLedger is a decentralized Blue Carbon Registry & MRV (Monitoring, Reporting, Verification) system built on Moonbeam, leveraging EVM compatibility and smart contracts to ensure transparency, immutability, and traceability of blue carbon credits.

This platform allows:

📊 Recording and verifying blue carbon sequestration data

🌱 Issuing and trading carbon tokens

🔗 Integration with MRV tools and IoT data streams

🔐 Secure user authentication via WalletConnect & MetaMask

🚀 Why Moonbeam?

Moonbeam combines Polkadot’s scalability & interoperability with Ethereum’s developer-friendly environment.

✨ Key Advantages

EVM-Compatible: Use Solidity, Hardhat, and MetaMask as with Ethereum.

Low Gas Fees: Cheaper transactions compared to mainnet Ethereum.

Interoperable: Access assets and data across Polkadot’s ecosystem.

Wallet Support: Works with MetaMask, WalletConnect, Talisman, and SubWallet.

⚙️ Project Setup
1️⃣ Clone the repository
git clone https://github.com/Shreyas578/BlueLedger1.git
cd BlueLedger1

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create all the .env files in the main project folder as well as the blockchain folder and fill all the important information in the env file provided.
Create a .env file in the root folder:

# Backend API
VITE_BACKEND_URL=http://localhost:3001

# WalletConnect
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Chain Configuration
# Moonbase Alpha (Testnet)
VITE_CHAIN_ID=1287
VITE_RPC_URL=https://rpc.api.moonbase.moonbeam.network

# Optional (Ethereum Sepolia)
# VITE_CHAIN_ID=11155111
# VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Smart Contracts
VITE_REGISTRY_CONTRACT_ADDRESS=0xYourDeployedRegistryAddress
VITE_CARBON_TOKEN_ADDRESS=0xYourDeployedTokenAddress

# Development Flags
VITE_ENABLE_MOCK_DATA=true

💫 Deployment on Moonbeam (Moonbase Alpha Testnet)
1️⃣ Compile Smart Contracts
npx hardhat compile

2️⃣ Deploy to Moonbase Alpha
npx hardhat run scripts/deploy.js --network moonbase


Your deployment will generate a file such as:

moonbase-1758794032498.json


This contains your contract addresses and ABI.

🧠 Smart Contract Stack

Solidity – Smart contract logic

Hardhat – Compilation, testing, deployment

Moonbeam EVM – Deployment target

Polkadot.js API (optional) – Cross-chain data & governance integration

🪐 Supported Wallets
Wallet	Supported	Network
MetaMask	✅	Moonbase Alpha / Moonbeam
WalletConnect	✅	Moonbeam
SubWallet	✅	Polkadot Ecosystem
Talisman	✅	Polkadot Ecosystem
🌍 Frontend Configuration

The frontend connects directly to Moonbeam using the VITE_RPC_URL and WalletConnect.
To start:

npm run dev


Then open:
👉 http://localhost:5173

THANK YOU!!!
