# Carbon Credits Minting Guide

## Overview

This guide explains how to use the blockchain-integrated carbon credits minting feature on the Government Dashboard.

## Prerequisites

1. **MetaMask Wallet** installed in your browser
2. **Sepolia Testnet** configured in MetaMask
3. **Test ETH** in your wallet (for gas fees)
4. **Government wallet** connected to the application

## Setup Instructions

### 1. Install MetaMask

- Install MetaMask browser extension from [metamask.io](https://metamask.io)
- Create a new wallet or import existing one
- **Save your seed phrase securely!**

### 2. Add Sepolia Testnet

Add Sepolia network to MetaMask with these details:

```
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
Chain ID: 11155111
Currency Symbol: ETH
Block Explorer: https://sepolia.etherscan.io
```

### 3. Get Test ETH

Visit one of these faucets to get free Sepolia test ETH:
- https://sepoliafaucet.com/
- https://faucet.sepolia.dev/
- https://sepolia-faucet.pk910.de/

You'll need at least 0.01 ETH for gas fees.

## How to Mint Carbon Credits

### Step 1: Connect Your Wallet

1. Navigate to the Government Dashboard
2. Click the "Connect Wallet" button
3. Select MetaMask and approve the connection
4. Ensure you're on Sepolia testnet (switch if needed)

### Step 2: Review Active Projects

The dashboard displays a table of **Active Projects** with:
- Project name and NGO
- Area in hectares
- **NDVI Growth percentage** (vegetation increase)
- Current carbon credits
- Last update timestamp

### Step 3: Check NDVI Growth

Projects are eligible for carbon credit minting when:
- ✅ **NDVI Growth ≥ 10%** (minimum threshold)
- ✅ Project status is "active" or "verified"
- ✅ Vegetation increase is verified

### Step 4: Generate Carbon Credits

1. Click the **"Generate Credits"** button next to a project
2. Review the minting details:
   - **Baseline NDVI**: Initial vegetation index
   - **Current NDVI**: Latest vegetation measurement
   - **Growth Percentage**: Increase in vegetation
   - **Credits to Mint**: Calculated amount

3. **Credit Calculation Formula**:
   ```
   Carbon Credits = Area (hectares) × NDVI Growth (%) × 5
   ```
   
   Example:
   - Area: 120 hectares
   - NDVI Growth: 20.6%
   - Credits: 120 × 0.206 × 5 = **123 BCC**

4. Click **"Mint X Credits"** button
5. Approve the transaction in MetaMask
6. Wait for blockchain confirmation (15-30 seconds)

### Step 5: Verify Transaction

After successful minting:
- ✅ Credits are added to your government wallet
- ✅ Transaction hash is displayed
- ✅ View on Etherscan by clicking the transaction link
- ✅ Your balance updates in the dashboard

## Smart Contract Details

### Deployed Contracts (Sepolia Testnet)

**Registry Contract:**
```
Address: 0x046BD349B6F8aC89a49176f1eaa85bc2eF1B6043
View: https://sepolia.etherscan.io/address/0x046BD349B6F8aC89a49176f1eaa85bc2eF1B6043
```

**Carbon Credit Token (BCC):**
```
Address: 0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7
View: https://sepolia.etherscan.io/address/0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7
Token Symbol: BCC
Decimals: 18
```

### Token Features

- **ERC-20 Standard**: Fully compatible with wallets and exchanges
- **Mintable**: Only authorized government wallets can mint
- **Burnable**: Credits can be retired (burned) for carbon offsetting
- **Batch Tracking**: Each mint creates a traceable batch with metadata
- **Transparent**: All transactions visible on blockchain

## Understanding NDVI

**NDVI (Normalized Difference Vegetation Index)** measures vegetation health:

- **Range**: -1.0 to +1.0
- **Healthy Vegetation**: 0.3 to 0.8
- **Sparse Vegetation**: 0.1 to 0.3
- **No Vegetation**: < 0.1

### NDVI Growth Thresholds

| Growth % | Status | Credits |
|----------|--------|---------|
| < 10% | ❌ Below threshold | Not eligible |
| 10-20% | ✅ Good growth | Standard rate |
| 20-30% | ✅ Excellent growth | Standard rate |
| > 30% | ✅ Outstanding growth | Standard rate |

## Troubleshooting

### Common Issues

**1. "Wallet Not Connected"**
- Solution: Click "Connect Wallet" and approve in MetaMask

**2. "Wrong Network"**
- Solution: Switch to Sepolia testnet in MetaMask

**3. "Insufficient Funds"**
- Solution: Get test ETH from Sepolia faucet

**4. "Transaction Failed"**
- Check gas settings in MetaMask
- Ensure you have enough ETH for gas
- Try increasing gas limit

**5. "NDVI Below Threshold"**
- Project needs at least 10% vegetation growth
- Wait for next NDVI update
- Check satellite data accuracy

### Gas Fees

Typical gas costs on Sepolia:
- **Minting Credits**: ~0.001-0.003 ETH
- **Approving Transaction**: ~0.0005 ETH

## Security Best Practices

1. ✅ **Never share** your private key or seed phrase
2. ✅ **Verify** contract addresses before transactions
3. ✅ **Double-check** transaction details in MetaMask
4. ✅ **Use test networks** for development
5. ✅ **Keep** MetaMask updated

## Viewing Your Credits

### In the Dashboard
- Your balance shows in "Blockchain Registry Status" card
- View all minted batches in transaction history

### In MetaMask
Add BCC token to MetaMask:
1. Open MetaMask
2. Click "Import tokens"
3. Enter contract address: `0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7`
4. Token symbol: BCC
5. Decimals: 18

### On Etherscan
View all your transactions:
```
https://sepolia.etherscan.io/address/YOUR_WALLET_ADDRESS
```

## API Integration (Optional)

For automated minting based on satellite data:

```javascript
import { contractService } from '@/services/contractService';

// Mint credits programmatically
const result = await contractService.mintCarbonCredits(
  projectContract,    // Project contract address
  recipientWallet,    // Government wallet
  amount,             // Number of credits
  projectName,        // Project name
  coordinates,        // Land coordinates
  ndviReadingId       // NDVI reading ID
);

console.log('Transaction:', result.txHash);
console.log('Batch ID:', result.batchId);
```

## Support

For issues or questions:
- Check transaction on Etherscan
- Review MetaMask activity
- Contact technical support with transaction hash

## Next Steps

After minting credits:
1. ✅ Credits appear in your wallet
2. ✅ Update project records
3. ✅ Generate compliance reports
4. ✅ Trade credits on marketplace (coming soon)
5. ✅ Retire credits for carbon offsetting

---

**Important**: This is a testnet implementation. For production deployment on Ethereum mainnet or Polygon, additional security audits and testing are required.
