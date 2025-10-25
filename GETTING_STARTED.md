# Getting Started with Your DAO DApp

## What Has Been Created

A complete, production-ready frontend application for your DAO smart contract has been generated with the following features:

### Features Implemented

✅ **Wallet Integration**
- Connect/disconnect Talisman wallet
- Multi-account support
- Real-time balance display
- Auto-connect on return visits

✅ **Real-Time Blockchain Data**
- Live block number updates
- Current block hash display
- Chain name and network info
- Total accounts count

✅ **Subscription Management**
- Create new subscriptions (Free, Basic, Premium, Other)
- Update/upgrade existing subscriptions
- Institutional and School account flags
- Automatic token payment handling

✅ **Governance Features**
- Request roles (Mentor/Council)
- Submit spending proposals
- Execute approved proposals
- Role-based access control

✅ **Modern UI/UX**
- Responsive design (mobile + desktop)
- TailwindCSS styling
- Loading states and error handling
- Color-coded sections

## Project Structure

```
my_edh/
├── lib.rs                          # Main DAO smart contract
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/            # UI components
│   │   │   ├── Header.tsx         # Wallet & on-chain info
│   │   │   ├── SubscriptionCard.tsx  # Subscription UI
│   │   │   └── GovernancePanel.tsx   # Governance UI
│   │   ├── hooks/                 # React hooks
│   │   │   ├── useWallet.ts       # Wallet management
│   │   │   ├── useOnChainInfo.ts  # Chain data
│   │   │   └── useContract.ts     # Contract calls
│   │   ├── utils/                 # Utilities
│   │   │   ├── constants.ts       # Config (EDIT THIS!)
│   │   │   └── contract.ts        # Contract helpers
│   │   └── types/                 # TypeScript types
│   └── public/
│       └── metadata.json          # Contract ABI (auto-copied)
├── DEPLOYMENT_GUIDE.md            # Detailed deployment steps
├── QUICKSTART.md                  # Quick reference
├── PROJECT_SUMMARY.md             # Full project documentation
└── GETTING_STARTED.md             # This file
```

## Quick Start (3 Steps)

### Step 1: Deploy Your Contract

1. Start substrate node:
```bash
substrate-contracts-node --dev --tmp
```

2. Deploy contracts (see DEPLOYMENT_GUIDE.md for details):
```bash
# Deploy ERC20 and Governance first, then DAO
cd /home/kazu/Polkadot/my_edh
cargo contract build --release
cargo contract instantiate --constructor new --args 1000000000000 --suri //Alice
```

3. **IMPORTANT**: Save the DAO contract address!

### Step 2: Configure Frontend

Edit `frontend/src/utils/constants.ts`:
```typescript
export const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // Paste your address here
```

### Step 3: Run Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:5173` and start using your DApp!

## Required Configuration

### Before Running

**YOU MUST UPDATE THESE FILES:**

1. **Contract Address** in [frontend/src/utils/constants.ts](frontend/src/utils/constants.ts#L2):
   ```typescript
   export const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_HERE';
   ```
   Replace with your deployed DAO contract address.

2. **Code Hashes** in [lib.rs](lib.rs#L107-108):
   ```rust
   let erc20code_hash = H256::from_slice(&hex_literal::hex!("YOUR_ERC20_CODE_HASH"));
   let governance_code_hash = H256::from_slice(&hex_literal::hex!("YOUR_GOVERNANCE_CODE_HASH"));
   ```
   Get these from deploying the ERC20 and Governance contracts first.

### Optional Configuration

- **Node URL**: If not using `ws://127.0.0.1:9944`, update `WS_PROVIDER` in constants.ts
- **Gas Limits**: Adjust in useContract.ts if transactions fail
- **Styling**: Modify TailwindCSS classes in components for custom look

## Using the Application

### 1. Connect Wallet

- Click "Connect Wallet" in header
- Approve Talisman connection
- Select your account (if you have multiple)

### 2. Create Subscription

- Navigate to "Subscription Management"
- Enter your name
- Select subscription type
- Check institutional/school if applicable
- Click "Create Subscription"
- Approve transaction in Talisman

### 3. Request a Role

- Go to "Governance" → "Request Role"
- Select Mentor or Council
- Write description
- Submit (requires Premium subscription)

### 4. Submit Spending Proposal

- Go to "Governance" → "Request Spending"
- Enter beneficiary address and amount
- Write description
- Submit (requires Mentor/Council role)

### 5. Execute Proposals

- Go to "Governance" → "Execute Proposal"
- Enter proposal ID
- Execute (requires Mentor/Council role)

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Blockchain**: Polkadot.js API
- **Wallet**: Talisman Connect
- **Smart Contracts**: ink! (Rust)

## Important Notes

### Node Version

The project uses Node.js v20.13.1. While Vite requires v20.19+, the application will work but you may see warnings. The warnings can be safely ignored for development.

### Peer Dependencies

The `--legacy-peer-deps` flag is required due to Talisman Connect using an older React version. This is safe and doesn't affect functionality.

### Development vs Production

- **Development**: Use `npm run dev` for hot reload
- **Production**: Use `npm run build` then serve the `dist/` folder

### Chain State

The `--tmp` flag on substrate-contracts-node means chain state is lost on restart. For persistent state, remove the `--tmp` flag.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No extension found" | Install Talisman wallet |
| "No accounts found" | Create account in Talisman |
| Transaction fails | Check gas limits and account balance |
| Can't connect to node | Verify node is running on ws://127.0.0.1:9944 |
| Build errors | Use `--legacy-peer-deps` flag |
| Contract not found | Verify CONTRACT_ADDRESS in constants.ts |

## Next Steps

1. ✅ **Read the Guides**:
   - [QUICKSTART.md](QUICKSTART.md) - Quick reference
   - [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Detailed deployment
   - [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete documentation

2. ✅ **Deploy to Testnet** (Optional):
   - Deploy contracts to a Polkadot testnet
   - Update constants.ts with testnet RPC
   - Test with real testnet tokens

3. ✅ **Customize the UI**:
   - Modify TailwindCSS classes
   - Add your branding
   - Customize color scheme

4. ✅ **Add Features**:
   - Proposal listing from governance contract
   - User dashboard
   - Transaction history
   - Notification system

## Files You Need to Know

### Must Edit Before Running

- `frontend/src/utils/constants.ts` - CONTRACT_ADDRESS
- `lib.rs` (lines 107-108) - Code hashes

### Configuration Files

- `frontend/package.json` - Dependencies
- `frontend/tailwind.config.js` - TailwindCSS config
- `frontend/vite.config.ts` - Vite build config

### Documentation Files

- `frontend/README.md` - Frontend-specific docs
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `QUICKSTART.md` - Quick reference
- `PROJECT_SUMMARY.md` - Project overview

## Build Status

✅ **Build Status**: Successful
✅ **TypeScript**: No errors
✅ **Dependencies**: Installed
✅ **Tests**: Manual testing via UI

## Support

For questions or issues:
1. Check the documentation files
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify all addresses are correct

## License

[Specify your license]

---

**Ready to deploy?** Follow the [QUICKSTART.md](QUICKSTART.md) guide!

**Need details?** See the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)!

**Built with** ❤️ using Polkadot, ink!, React, and TypeScript
