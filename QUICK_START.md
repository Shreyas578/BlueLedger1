# 🚀 Quick Start Guide - Carbon Credits Minting

## Get Started in 5 Minutes!

### Step 1: Install MetaMask (2 minutes)

1. Go to [metamask.io](https://metamask.io)
2. Click "Download" and install browser extension
3. Create new wallet or import existing
4. **Save your seed phrase securely!**

### Step 2: Add Sepolia Testnet (1 minute)

In MetaMask:
1. Click network dropdown (top)
2. Click "Add Network"
3. Enter these details:

```
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
Chain ID: 11155111
Currency Symbol: ETH
```

### Step 3: Get Test ETH (1 minute)

Visit: https://sepoliafaucet.com/
- Paste your wallet address
- Click "Send Me ETH"
- Wait 30 seconds

### Step 4: Run the Application (1 minute)

```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# In another terminal, start backend
cd backend
npm run dev
```

Open: http://localhost:5173

### Step 5: Mint Your First Credits! (30 seconds)

1. Navigate to **Government Dashboard**
2. Click **"Connect Wallet"**
3. Approve MetaMask connection
4. Find a project with **green growth indicator** (≥10%)
5. Click **"Generate Credits"**
6. Review details in modal
7. Click **"Mint X Credits"**
8. Approve in MetaMask
9. Wait for confirmation
10. **Done!** 🎉

## 🎯 What You'll See

### Dashboard View
```
┌─────────────────────────────────────────┐
│  Active Projects - Vegetation Monitoring │
├─────────────────────────────────────────┤
│ Project Name    │ NDVI Growth │ Action  │
│ Sundarbans      │ ⬆️ 20.6% ✅  │ [Mint]  │
│ Chilika Lake    │ ⬆️ 25.0% ✅  │ [Mint]  │
│ Pulicat Lake    │ ⬆️ 9.4% ❌   │ [Mint]  │
└─────────────────────────────────────────┘
```

### Minting Modal
```
┌─────────────────────────────────────┐
│  Generate Carbon Credits            │
├─────────────────────────────────────┤
│  Project: Sundarbans Restoration    │
│  Area: 120 hectares                 │
│                                     │
│  📊 Vegetation Growth               │
│  Baseline: 0.34                     │
│  Current:  0.41                     │
│  Growth:   ⬆️ 20.6% ✅              │
│                                     │
│  💰 Credits to Mint: 123 BCC        │
│                                     │
│  [Cancel]  [Mint 123 Credits]      │
└─────────────────────────────────────┘
```

## 🧪 Test Data

The app automatically creates 5 test projects:

| Project | Growth | Eligible |
|---------|--------|----------|
| Sundarbans | 20.6% | ✅ Yes |
| Chilika Lake | 25.0% | ✅ Yes |
| Godavari Delta | 13.3% | ✅ Yes |
| Pulicat Lake | 9.4% | ❌ No |
| Bhitarkanika | 33.3% | ✅ Yes |

## 💡 Pro Tips

### Console Commands
Open browser console (F12) and try:

```javascript
// View statistics
testData.stats()

// Simulate NDVI growth
testData.simulate('test-proj-4', 0.02)

// Update specific NDVI
testData.updateNDVI('test-proj-4', 0.40)

// Refresh page to see changes
location.reload()
```

### Quick Testing Flow
1. Open console
2. Run: `testData.simulate('test-proj-4', 0.02)`
3. Refresh page
4. Project now eligible (growth > 10%)
5. Mint credits!

## 🔍 Verify on Blockchain

After minting:
1. Click transaction hash link
2. Opens Etherscan
3. See your transaction details
4. View minted tokens

**Your Wallet:**
```
https://sepolia.etherscan.io/address/YOUR_ADDRESS
```

**Token Contract:**
```
https://sepolia.etherscan.io/address/0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7
```

## 📱 Add Token to MetaMask

1. Open MetaMask
2. Click "Import tokens"
3. Paste: `0xED7a9D61091CBFB927aAe5B897d7aebb81E633D7`
4. Symbol: BCC
5. Decimals: 18
6. Click "Add"

Now you can see your BCC balance in MetaMask!

## ❓ Troubleshooting

### "Wallet Not Connected"
→ Click "Connect Wallet" button

### "Wrong Network"
→ Switch to Sepolia in MetaMask

### "Insufficient Funds"
→ Get test ETH from faucet

### "Transaction Failed"
→ Check you have enough ETH for gas

### "NDVI Below Threshold"
→ Use console to simulate growth:
```javascript
testData.simulate('PROJECT_ID', 0.05)
```

## 📚 Learn More

- **Full Guide**: See `CARBON_CREDITS_MINTING_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Blockchain Setup**: See `BLOCKCHAIN_SETUP.md`

## 🎉 Success Checklist

- [ ] MetaMask installed
- [ ] Sepolia network added
- [ ] Test ETH received
- [ ] Application running
- [ ] Wallet connected
- [ ] Test project visible
- [ ] Credits minted
- [ ] Transaction verified
- [ ] Balance updated

## 🚀 Next Steps

1. ✅ Mint credits for all eligible projects
2. ✅ View transactions on Etherscan
3. ✅ Check balance in MetaMask
4. ✅ Explore other dashboard features
5. ✅ Try the carbon marketplace

## 💬 Need Help?

- Check the full documentation
- Review transaction on Etherscan
- Verify wallet connection
- Ensure correct network

---

**Ready to mint carbon credits?** Let's go! 🌊🌱

**Time to complete**: ~5 minutes
**Difficulty**: Easy
**Prerequisites**: Browser + Internet
