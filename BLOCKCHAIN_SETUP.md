# Blockchain Integration Setup Guide

## Project Structure

```
blue-reef-registry-main/
├── blockchain/                 # Smart contracts and deployment
│   ├── contracts/             # Solidity smart contracts
│   ├── scripts/              # Deployment scripts
│   ├── test/                 # Contract tests
│   └── hardhat.config.ts     # Hardhat configuration
├── backend/                   # Mock backend services
│   ├── src/                  # Backend source code
│   └── package.json          # Backend dependencies
├── src/                      # Frontend (existing + Web3 integration)
│   ├── config/               # Web3 and environment configuration
│   ├── hooks/                # Web3 custom hooks
│   ├── services/             # Blockchain interaction services
│   └── components/           # Enhanced UI components
└── package.json              # Frontend dependencies (with Web3 libs)
```

## Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies (including Web3 libraries)
npm install

# Install blockchain development dependencies
cd blockchain
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment files
cp .env.example .env
cp blockchain/.env.example blockchain/.env
cp backend/.env.example backend/.env
```

### 3. MetaMask Setup

1. Install MetaMask browser extension
2. Create or import a wallet
3. Add Sepolia testnet to MetaMask:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
   - Chain ID: 11155111
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.etherscan.io

### 4. Get Test ETH

Visit a Sepolia faucet to get test ETH:
- https://sepoliafaucet.com/
- https://faucet.sepolia.dev/

### 5. Development Workflow

```bash
# Start local blockchain (optional)
cd blockchain
npx hardhat node

# Deploy contracts to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia

# Start backend services
cd ../backend
npm run dev

# Start frontend
cd ..
npm run dev
```

## Next Steps

1. Complete smart contract development (Task 2)
2. Implement mock backend services (Task 4)
3. Add Web3 integration to frontend (Task 5)
4. Enhance existing UI components (Task 6)

## Troubleshooting

### Common Issues

1. **MetaMask not detected**: Ensure MetaMask is installed and enabled
2. **Wrong network**: Switch to Sepolia testnet in MetaMask
3. **Insufficient funds**: Get test ETH from Sepolia faucet
4. **Contract not deployed**: Run deployment script first

### Support

- Hardhat Documentation: https://hardhat.org/docs
- Wagmi Documentation: https://wagmi.sh/
- MetaMask Documentation: https://docs.metamask.io/