# Carbon Credits Minting Flow Diagram

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    BLUE REEF CARBON CREDITS                      │
│                    Blockchain Minting System                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: PROJECT SETUP                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  NGO Submits Application                                        │
│         │                                                        │
│         ├──> Project Details                                    │
│         ├──> Land Coordinates                                   │
│         ├──> Area (hectares)                                    │
│         └──> Documents                                          │
│                                                                  │
│  Government Reviews                                             │
│         │                                                        │
│         ├──> Verify Documents                                   │
│         ├──> Check Land Rights                                  │
│         └──> Approve/Reject                                     │
│                                                                  │
│  ✅ Project Status: ACTIVE                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: VEGETATION MONITORING                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🛰️  Satellite Data Collection                                 │
│         │                                                        │
│         ├──> Baseline NDVI (2017): 0.34                        │
│         ├──> Current NDVI (2024):  0.41                        │
│         └──> Calculate Growth:     +20.6%                      │
│                                                                  │
│  📊 NDVI Analysis                                               │
│         │                                                        │
│         ├──> Growth ≥ 10%? ✅ YES                               │
│         ├──> Vegetation Healthy? ✅ YES                         │
│         └──> Eligible for Credits? ✅ YES                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: GOVERNMENT DASHBOARD                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 Government User Logs In                                     │
│         │                                                        │
│         └──> Views Active Projects Table                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────┐        │
│  │ Project Name    │ NDVI Growth │ Credits │ Action  │        │
│  ├────────────────────────────────────────────────────┤        │
│  │ Sundarbans      │ ⬆️ 20.6% ✅  │ 0 BCC   │ [Mint]  │        │
│  │ Chilika Lake    │ ⬆️ 25.0% ✅  │ 0 BCC   │ [Mint]  │        │
│  │ Pulicat Lake    │ ⬆️ 9.4% ❌   │ 0 BCC   │ [Mint]  │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
│  🔍 Government Reviews NDVI Data                                │
│         │                                                        │
│         ├──> Sees 20.6% vegetation increase                    │
│         ├──> Verifies satellite imagery                        │
│         └──> Decides to mint credits                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: WALLET CONNECTION                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🦊 MetaMask Integration                                        │
│         │                                                        │
│         ├──> Click "Connect Wallet"                            │
│         ├──> MetaMask Popup Opens                              │
│         ├──> User Approves Connection                          │
│         └──> Wallet Connected ✅                                │
│                                                                  │
│  🌐 Network Verification                                        │
│         │                                                        │
│         ├──> Check Current Network                             │
│         ├──> Is Sepolia? ✅ YES                                 │
│         └──> Ready to Transact                                 │
│                                                                  │
│  💰 Balance Check                                               │
│         │                                                        │
│         ├──> ETH Balance: 0.05 ETH ✅                           │
│         ├──> BCC Balance: 0 BCC                                │
│         └──> Sufficient for Gas ✅                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: CREDIT CALCULATION                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📐 Formula Application                                         │
│                                                                  │
│      Credits = Area × NDVI Growth × Conversion Factor          │
│                                                                  │
│      Credits = 120 ha × 20.6% × 5                              │
│                                                                  │
│      Credits = 120 × 0.206 × 5                                 │
│                                                                  │
│      Credits = 123.6 ≈ 123 BCC                                 │
│                                                                  │
│  ✅ Calculation Complete: 123 Carbon Credits                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: MINTING MODAL                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🖱️  User Clicks "Generate Credits"                            │
│         │                                                        │
│         └──> Modal Opens                                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │  💰 Generate Carbon Credits                      │          │
│  ├──────────────────────────────────────────────────┤          │
│  │                                                   │          │
│  │  📋 Project Information                          │          │
│  │  • Name: Sundarbans Restoration                 │          │
│  │  • Location: West Bengal, India                 │          │
│  │  • Area: 120 hectares                           │          │
│  │                                                   │          │
│  │  🌱 Vegetation Growth Analysis                   │          │
│  │  • Baseline NDVI: 0.34                          │          │
│  │  • Current NDVI:  0.41                          │          │
│  │  • Growth: ⬆️ 20.6% ✅                           │          │
│  │                                                   │          │
│  │  💎 Carbon Credits Calculation                   │          │
│  │  • Area: 120 ha                                 │          │
│  │  • Growth: 20.6%                                │          │
│  │  • Factor: 5x                                   │          │
│  │  • Total: 123 BCC                               │          │
│  │                                                   │          │
│  │  📍 Recipient: 0x1234...5678 (Gov Wallet)       │          │
│  │                                                   │          │
│  │  [Cancel]  [Mint 123 Credits] ←─────────────    │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 7: BLOCKCHAIN TRANSACTION                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔐 Transaction Preparation                                     │
│         │                                                        │
│         ├──> Function: mintCredits()                           │
│         ├──> Parameters:                                        │
│         │    • projectContract: 0xABC...                       │
│         │    • recipient: 0x1234... (Gov)                      │
│         │    • amount: 123000000000000000000 (123 * 10^18)    │
│         │    • projectName: "Sundarbans..."                    │
│         │    • coordinates: "22.5°N, 89.0°E"                  │
│         │    • ndviReadingId: 1704067200                      │
│         └──> Gas Estimate: 0.002 ETH                           │
│                                                                  │
│  🦊 MetaMask Confirmation                                       │
│         │                                                        │
│         ├──> Popup Opens                                        │
│         ├──> Shows Transaction Details                         │
│         ├──> User Reviews                                       │
│         └──> User Clicks "Confirm"                             │
│                                                                  │
│  📡 Broadcast to Network                                        │
│         │                                                        │
│         ├──> Transaction Sent to Sepolia                       │
│         ├──> Pending in Mempool                                │
│         ├──> Miner Picks Up Transaction                        │
│         └──> Block Confirmation (15-30 sec)                    │
│                                                                  │
│  ✅ Transaction Confirmed                                       │
│         │                                                        │
│         ├──> Block Number: 5,234,567                           │
│         ├──> Transaction Hash: 0xdef456...                     │
│         ├──> Gas Used: 0.0018 ETH                              │
│         └──> Status: Success ✅                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 8: SMART CONTRACT EXECUTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📜 CarbonCreditToken.sol                                       │
│         │                                                        │
│         ├──> Verify Caller (Government Role) ✅                 │
│         ├──> Validate Parameters ✅                             │
│         ├──> Create Credit Batch                               │
│         │    • Batch ID: 42                                    │
│         │    • Amount: 123 BCC                                 │
│         │    • Timestamp: 1704067200                           │
│         │    • Project: Sundarbans                             │
│         │    • NDVI Reading: #1234                             │
│         ├──> Mint Tokens                                        │
│         │    • _mint(govWallet, 123 BCC)                       │
│         ├──> Update Tracking                                    │
│         │    • totalSupplyMinted += 123                        │
│         │    • totalMintedByProject[proj] += 123              │
│         │    • userBatches[gov].push(42)                       │
│         └──> Emit Event                                         │
│              • CreditsMinted(42, proj, gov, 123, "Sundarbans") │
│                                                                  │
│  🔗 Blockchain State Updated                                    │
│         │                                                        │
│         ├──> Government Balance: 0 → 123 BCC                   │
│         ├──> Total Supply: 1000 → 1123 BCC                     │
│         └──> Batch #42 Created                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 9: SUCCESS CONFIRMATION                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🎉 Success Modal                                               │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │                                                   │          │
│  │           ✅ Credits Minted Successfully!         │          │
│  │                                                   │          │
│  │     123 carbon credits have been minted          │          │
│  │          to your wallet                          │          │
│  │                                                   │          │
│  │  Amount Minted: 123 BCC                          │          │
│  │  Transaction: 0xdef4...89ab 🔗                   │          │
│  │                                                   │          │
│  │              [Close]                             │          │
│  │                                                   │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  📊 Dashboard Updates                                           │
│         │                                                        │
│         ├──> Government Balance: 123 BCC                       │
│         ├──> Project Credits: 123 BCC                          │
│         ├──> Total Supply: 1123 BCC                            │
│         └──> Transaction History Updated                       │
│                                                                  │
│  🔔 Notifications                                               │
│         │                                                        │
│         ├──> Toast: "123 credits minted successfully!"         │
│         ├──> Email: Sent to government admin                   │
│         └──> NGO Notified: Credits allocated                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 10: VERIFICATION & TRANSPARENCY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Etherscan Verification                                      │
│         │                                                        │
│         ├──> View Transaction                                   │
│         │    https://sepolia.etherscan.io/tx/0xdef456...       │
│         │                                                        │
│         ├──> Transaction Details:                              │
│         │    • From: 0x1234... (Gov Wallet)                    │
│         │    • To: 0xED7a... (Token Contract)                  │
│         │    • Value: 0 ETH                                    │
│         │    • Gas: 0.0018 ETH                                 │
│         │    • Status: Success ✅                               │
│         │                                                        │
│         └──> Event Logs:                                        │
│              • CreditsMinted(42, ..., 123)                     │
│              • Transfer(0x0, 0x1234, 123)                      │
│                                                                  │
│  📱 MetaMask Balance                                            │
│         │                                                        │
│         ├──> Add BCC Token                                      │
│         ├──> Contract: 0xED7a...                               │
│         └──> Balance Shows: 123 BCC ✅                          │
│                                                                  │
│  🌐 Public Transparency                                         │
│         │                                                        │
│         ├──> Anyone Can Verify                                  │
│         ├──> Immutable Record                                   │
│         ├──> Audit Trail Complete                              │
│         └──> Carbon Offset Proven                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  FINAL STATE                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Government Wallet                                           │
│     • BCC Balance: 123 tokens                                  │
│     • ETH Balance: 0.048 ETH (after gas)                       │
│     • Batch #42 owned                                          │
│                                                                  │
│  ✅ Project Status                                              │
│     • Credits Issued: 123 BCC                                  │
│     • NDVI Growth: 20.6%                                       │
│     • Status: Active                                           │
│     • Next Review: 3 months                                    │
│                                                                  │
│  ✅ Blockchain Record                                           │
│     • Transaction: Permanent                                    │
│     • Batch Metadata: Stored                                   │
│     • Audit Trail: Complete                                    │
│     • Public Verification: Available                           │
│                                                                  │
│  ✅ Environmental Impact                                        │
│     • Vegetation Increase: 20.6%                               │
│     • Carbon Sequestered: ~123 tons CO₂                        │
│     • Area Restored: 120 hectares                              │
│     • Ecosystem Health: Improving                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Continuous Cycle

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  Monitor NDVI → Growth Detected → Mint Credits       │
│       ↑                                      ↓        │
│       │                                      │        │
│       └──────── Repeat Every 3 Months ───────┘       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

## 📊 Data Flow Summary

```
Satellite → NDVI Data → Dashboard → User Action → 
MetaMask → Blockchain → Smart Contract → Token Mint → 
Wallet Balance → Verification → Public Record
```

## 🎯 Key Decision Points

1. **NDVI Threshold**: Growth ≥ 10%?
2. **Wallet Connected**: MetaMask active?
3. **Correct Network**: On Sepolia?
4. **Sufficient Gas**: Enough ETH?
5. **User Confirmation**: Approve transaction?

## ✨ Success Indicators

- ✅ Green growth indicator
- ✅ Wallet connected badge
- ✅ Transaction confirmed
- ✅ Balance updated
- ✅ Etherscan verification

---

**Total Time**: ~2 minutes from click to confirmation
**Gas Cost**: ~0.002 ETH (~$5 on mainnet)
**Transparency**: 100% public and verifiable
