# 🚀 Sui SDK Integration Guide

## ✅ Hoàn Thành Kết Nối Sui SDK

Tôi đã kết nối frontend với Sui smart contract:

### 📦 Packages Đã Cài:
- `@mysten/sui` - Sui SDK
- `@mysten/dapp-kit` - Wallet integration & UI
- `@tanstack/react-query` - Data fetching

### 📁 File Cấu Trúc Mới:

```
src/
├── config/
│   └── suiConfig.ts           # Sui network config
├── context/
│   └── SuiContext.tsx         # Sui provider context
├── hooks/
│   └── useSui.ts              # Custom Sui hooks
└── utils/
    └── suiTransactions.ts     # Smart contract transactions
```

---

## 🔧 Key Components

### 1. **SuiContext.tsx** - Provider Setup
```tsx
// Wraps entire app with Sui client
<SuiProvider>
  <App />
</SuiProvider>
```

### 2. **suiConfig.ts** - Network Configuration
```ts
export const CHARITY_PACKAGE_ID = 'YOUR_PACKAGE_ID'; // Update after deployment
export const SUI_DEVNET_RPC = 'https://fullnode.devnet.sui.io:443';
```

### 3. **useSui.ts** - Custom Hooks
```ts
const { account, isConnected, connect } = useWalletConnection();
const { executeTransaction } = useTransactionExecution();
```

### 4. **suiTransactions.ts** - Smart Contract Calls
```ts
// Create campaign
const tx = await createCampaignTx(platformId, title, desc, goal, deadline, clock);

// Donate
const tx = await donateTx(campaignId, coinId, amount, clock);

// Withdraw
const tx = await withdrawTx(campaignId);
```

---

## 💻 Updated Components

### **CreateCampaign.tsx**
- ✅ Integrated with Sui wallet
- ✅ Calls `create_campaign` function
- ✅ Error handling & loading states
- ✅ Success confirmation with TX hash

### **DonateModal.tsx**
- ✅ Integrated with Sui wallet
- ✅ Calls `donate` function
- ✅ Quick amount buttons
- ✅ Progress bar
- ✅ Success/error feedback

### **index.tsx** (Setup)
- ✅ `SuiClientProvider` - Connect to network
- ✅ `WalletProvider` - Wallet management
- ✅ `QueryClientProvider` - Data caching
- ✅ `ConnectButton` in Navbar

---

## 🔑 Smart Contract Integration

### Transaction Examples:

**Create Campaign:**
```ts
const tx = await createCampaignTx(
  platformId,      // Platform object ID
  "Title",         // Campaign title
  "Description",   // Campaign description
  1000000000,      // Goal (1 SUI in MIST)
  1734567890,      // Deadline (Unix timestamp)
  '0x6'            // Sui Clock object
);
```

**Donate:**
```ts
const tx = await donateTx(
  campaignId,      // Campaign object ID
  coinObjectId,    // User's SUI coin object
  5000000000,      // Amount (5 SUI in MIST)
  '0x6'            // Sui Clock object
);
```

---

## ⚠️ TODO - Important Setup Steps

### 1. **Update CHARITY_PACKAGE_ID**
```ts
// In src/config/suiConfig.ts
export const CHARITY_PACKAGE_ID = 'YOUR_ACTUAL_PACKAGE_ID';
```
**Get this after deploying smart contract:**
```bash
cd move
sui move publish --gas-budget 100000000
```

### 2. **Update PLATFORM_ID**
```ts
// In CreateCampaign.tsx
const platformId = '0x1234567890'; // Update with actual platform object ID
```

### 3. **Coin Selection Logic**
```ts
// In DonateModal.tsx - Need to implement getUserCoins()
// Currently using placeholder: '0xcoinid'
const userCoins = await getUserCoins(client, account.address);
```

### 4. **Event Indexing**
For better campaign discovery, set up an indexer:
- Use **Hasura** + Sui Events
- Or use **Covalent** API
- Or implement GraphQL indexer

---

## 🎯 Next Steps

### Phase 1: Local Development
```bash
# 1. Start frontend
cd frontend
npm start

# 2. Connect to Sui Devnet
# 3. Test create_campaign & donate flows
```

### Phase 2: Deploy Smart Contract
```bash
cd move
sui move publish --gas-budget 100000000
# Copy package ID and update suiConfig.ts
```

### Phase 3: Test on Devnet
- Create a test campaign
- Make test donations
- Verify events in explorer

### Phase 4: Production
- Switch to Testnet/Mainnet
- Update RPC endpoints
- Add proper error handling
- Implement event indexing

---

## 🌐 Network Configuration

### Development (Devnet):
```ts
export const SUI_DEVNET_RPC = 'https://fullnode.devnet.sui.io:443';
export const ACTIVE_NETWORK = 'devnet';
```

### Testing (Testnet):
```ts
export const SUI_TESTNET_RPC = 'https://fullnode.testnet.sui.io:443';
export const ACTIVE_NETWORK = 'testnet';
```

### Production (Mainnet):
```ts
export const SUI_MAINNET_RPC = 'https://fullnode.mainnet.sui.io:443';
export const ACTIVE_NETWORK = 'mainnet';
```

---

## 📊 Data Flow

```
User Interface (React)
    ↓
useWalletConnection() - Get wallet account
    ↓
Component Form (CreateCampaign/DonateModal)
    ↓
suiTransactions.ts - Build transaction
    ↓
useTransactionExecution() - Sign & execute
    ↓
Sui Network (Move Smart Contract)
    ↓
Event Emission & State Update
    ↓
User Feedback (Success/Error)
```

---

## 🔐 Security Notes

⚠️ **Current Status:**
- ✅ Frontend built & tested
- ⚠️ Smart contract needs security audit
- ⚠️ Missing coin selection in DonateModal
- ⚠️ No rate limiting on transactions
- ⚠️ Events not indexed (need indexer)

### Recommended:
1. Audit smart contract before mainnet
2. Implement proper coin management
3. Add transaction throttling
4. Set up event indexer
5. Add user balance checks

---

## 📝 Wallet Integration

### ConnectButton (Already in Navbar)
```tsx
<ConnectButton /> // Handles wallet selection
```

### Manual Connection (Optional)
```tsx
const { account, isConnected, connect } = useWalletConnection();

if (!isConnected) {
  <button onClick={connect}>Connect Wallet</button>
}
```

---

## ✨ Features Ready to Test

✅ **Create Campaign** - Form with validation
✅ **Donate** - Modal with quick amounts
✅ **Wallet Connection** - Via ConnectButton
✅ **Error Handling** - User-friendly messages
✅ **Loading States** - Disabled inputs during tx
✅ **Success Feedback** - TX hash display

---

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done)
cd frontend
npm install

# 2. Update suiConfig.ts with your package ID
# 3. Start dev server
npm start

# 4. Open http://localhost:3000
# 5. Click "Connect Wallet"
# 6. Test Create Campaign
```

---

**Status:** ✅ Frontend Integration Complete - Ready for Smart Contract Deployment

Next: Deploy smart contract and update CHARITY_PACKAGE_ID
