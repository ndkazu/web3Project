# Quick Start Guide - DAO DApp

This is a condensed guide to get your DAO DApp up and running quickly.

## Prerequisites

- Rust + cargo-contract installed
- substrate-contracts-node installed
- Node.js v20+ installed
- Talisman wallet extension installed in browser

## 5-Minute Setup

### 1. Start Local Node (Terminal 1)

```bash
substrate-contracts-node --dev --tmp
```

Keep this running!

### 2. Deploy Contracts (Terminal 2)

```bash
# Build and deploy ERC20
cd /home/kazu/Polkadot/my_edh/other_contracts/my_erc20
cargo contract build --release
cargo contract instantiate --constructor new --args 1000000000000 --suri //Alice --skip-confirm

# Save the ERC20 contract code hash!

# Build and deploy Governance
cd ../governance
cargo contract build --release
cargo contract instantiate --constructor new --args 50 --suri //Alice --skip-confirm

# Save the Governance contract code hash!

# Update lib.rs with both code hashes at lines 107-108
cd /home/kazu/Polkadot/my_edh
# Edit lib.rs and update the code hashes

# Build and deploy DAO
cargo contract build --release
cargo contract instantiate --constructor new --args 1000000000000 --suri //Alice --skip-confirm

# SAVE THIS CONTRACT ADDRESS - you'll need it for the frontend!
```

### 3. Configure Talisman

1. Open Talisman → Settings → Networks
2. Add network:
   - Name: Local Node
   - RPC: ws://127.0.0.1:9944
3. Import account: `//Alice`

### 4. Setup Frontend (Terminal 3)

```bash
cd /home/kazu/Polkadot/my_edh/frontend

# Install dependencies (first time only)
npm install --legacy-peer-deps

# Update contract address in src/utils/constants.ts
# Replace YOUR_CONTRACT_ADDRESS_HERE with your DAO contract address

# Start frontend
npm run dev
```

### 5. Open Browser

1. Navigate to `http://localhost:5173`
2. Click "Connect Wallet"
3. Approve Talisman connection
4. You're ready to use the DApp!

## Quick Test

1. **Create Subscription**:
   - Name: "Test User"
   - Type: Free
   - Click "Create Subscription"
   - Approve in Talisman

2. **Check Chain Info**:
   - Watch block number increase in header
   - Verify account balance displays

## Common Issues

| Problem | Solution |
|---------|----------|
| Can't connect wallet | Install Talisman, add Local Node network |
| Transaction fails | Verify contract address in constants.ts |
| No chain info | Check substrate node is running on port 9944 |
| Build errors | Use `--legacy-peer-deps` flag with npm install |

## File Locations

- Contract address config: `frontend/src/utils/constants.ts`
- Contract ABI: `frontend/public/metadata.json`
- Main contract: `lib.rs`
- Frontend README: `frontend/README.md`
- Full deployment guide: `DEPLOYMENT_GUIDE.md`

## Important Notes

- The `--tmp` flag clears chain data on restart
- Alice account has default funds for testing
- Use `//Bob` for a second test account
- Code hashes must match deployed contracts

## Next Steps

After basic setup works:
- Read [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions
- Read [frontend/README.md](frontend/README.md) for frontend features
- Test all subscription tiers
- Try governance features
