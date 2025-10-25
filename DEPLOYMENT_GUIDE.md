# Complete Deployment Guide - DAO DApp

This guide will walk you through deploying the DAO smart contract and running the frontend on a local Substrate node.

## Prerequisites

Ensure you have installed:

- Rust and Cargo (latest stable)
- cargo-contract (`cargo install cargo-contract`)
- substrate-contracts-node
- Node.js v20+
- Talisman Wallet browser extension

## Step-by-Step Deployment

### Phase 1: Start Local Substrate Node

1. Open a terminal and start your local development node:

```bash
substrate-contracts-node --dev --tmp
```

**Note**: Keep this terminal running throughout the process. The `--tmp` flag means the chain state will be cleared when you stop the node.

You should see output like:
```
2024-10-12 03:00:00 Substrate Contracts Node
2024-10-12 03:00:00 Local node identity is: 12D3KooW...
2024-10-12 03:00:00 Running JSON-RPC server: addr=127.0.0.1:9944
```

### Phase 2: Deploy Smart Contracts

The DAO contract depends on two other contracts (ERC20 and Governance), so we need to deploy them first.

#### 2.1: Build All Contracts

```bash
cd /home/kazu/Polkadot/my_edh

# Build the main DAO contract
cargo contract build --release

# Build ERC20 contract
cd other_contracts/my_erc20
cargo contract build --release

# Build Governance contract
cd ../governance
cargo contract build --release
```

#### 2.2: Deploy ERC20 Contract

```bash
cd /home/kazu/Polkadot/my_edh/other_contracts/my_erc20

cargo contract instantiate \
  --constructor new \
  --args 1000000000000 \
  --suri //Alice \
  --skip-confirm
```

**IMPORTANT**: Save the contract address from the output!
Look for: `Contract 5Abc...xyz1`

Example:
```
Contract 5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY
```

Update [lib.rs:107](lib.rs#L107) with the ERC20 code hash (you can find it in the output or in `target/ink/my_erc20.contract`).

#### 2.3: Deploy Governance Contract

```bash
cd /home/kazu/Polkadot/my_edh/other_contracts/governance

cargo contract instantiate \
  --constructor new \
  --args 50 \
  --suri //Alice \
  --skip-confirm
```

**IMPORTANT**: Save this contract address too!

Update [lib.rs:108](lib.rs#L108) with the Governance code hash.

#### 2.4: Deploy DAO Contract

After updating the code hashes in lib.rs, rebuild and deploy the main contract:

```bash
cd /home/kazu/Polkadot/my_edh

cargo contract build --release

cargo contract instantiate \
  --constructor new \
  --args 1000000000000 \
  --suri //Alice \
  --skip-confirm
```

**IMPORTANT**: This is your main DAO contract address - you'll need this for the frontend!

Example output:
```
Contract 5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc
```

### Phase 3: Configure Talisman Wallet

1. **Install Talisman** (if not already installed):
   - Chrome: https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/
   - Firefox: https://addons.mozilla.org/firefox/addon/talisman-wallet-extension/

2. **Add Local Network**:
   - Open Talisman wallet
   - Click Settings → Networks → Add Network
   - Fill in:
     - Name: `Local Node`
     - RPC URL: `ws://127.0.0.1:9944`
     - Click "Add"

3. **Import Development Accounts**:
   - Click on account dropdown → "Add Account" → "Import"
   - Import Alice's account:
     - Select "Mnemonic Seed"
     - Enter: `//Alice`
     - Name it "Alice (Dev)"
   - Repeat for Bob:
     - Seed: `//Bob`
     - Name: "Bob (Dev)"

4. **Verify Balance**:
   - Switch to Local Node network
   - Alice should have a large balance (~1000000 units)

### Phase 4: Configure Frontend

1. **Navigate to frontend directory**:
```bash
cd /home/kazu/Polkadot/my_edh/frontend
```

2. **Update contract address**:

Edit `src/utils/constants.ts`:
```typescript
export const CONTRACT_ADDRESS = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'; // Your DAO contract address
```

3. **Verify metadata is copied**:
```bash
ls public/metadata.json
```

This should exist and contain the contract ABI.

### Phase 5: Start Frontend

1. **Install dependencies** (if not already done):
```bash
npm install --legacy-peer-deps
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser**:
   - Navigate to `http://localhost:5173`
   - You should see the DAO DApp interface

### Phase 6: Connect and Test

1. **Connect Wallet**:
   - Click "Connect Wallet" in the header
   - Talisman popup will appear
   - Select "Alice (Dev)" account
   - Click "Connect"

2. **Verify Connection**:
   - Header should show:
     - Chain name
     - Current block number (updating in real-time)
     - Connected account address
     - Account balance

3. **Test Subscription Creation**:
   - Go to "Subscription Management"
   - Fill in:
     - Name: "Test User"
     - Subscription Type: "Free" (for testing)
   - Click "Create Subscription"
   - Approve transaction in Talisman
   - Wait for confirmation

4. **Monitor Transaction**:
   - Watch the terminal running substrate-contracts-node
   - You should see new blocks being produced
   - Transaction should be included in a block

## Troubleshooting

### Contract Deployment Issues

**Error**: "Module error"
- Check that all code hashes are correct in lib.rs
- Rebuild contracts after updating code hashes

**Error**: "Insufficient balance"
- Make sure you're using Alice's account (has default funds)

### Frontend Connection Issues

**Error**: "No extension found"
- Install Talisman wallet and refresh the page

**Error**: "Failed to connect"
- Verify substrate node is running
- Check that Talisman is connected to Local Node network
- Try restarting the substrate node

### Transaction Failures

**Error**: Transaction reverted
- Check contract logic requirements (e.g., Premium subscription for role requests)
- Verify account has sufficient balance
- Check console for detailed error messages

## Architecture Overview

```
┌─────────────────────┐
│   Frontend (React)  │
│  (Port: 5173)       │
└──────────┬──────────┘
           │
           │ Polkadot.js API
           │
┌──────────▼──────────┐
│  Substrate Node     │
│  (Port: 9944)       │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
┌────▼───┐  ┌───▼────┐  ┌──────────┐
│  DAO   │──│ ERC20  │  │Governance│
│Contract│  │Contract│  │ Contract │
└────────┘  └────────┘  └──────────┘
```

## Contract Addresses Checklist

Keep track of your deployed contracts:

- [ ] ERC20 Contract Address: `_________________`
- [ ] Governance Contract Address: `_________________`
- [ ] DAO Contract Address: `_________________`
- [ ] Updated frontend constants.ts: [ ]

## Testing Checklist

- [ ] Local node is running
- [ ] All three contracts deployed successfully
- [ ] Frontend is running
- [ ] Talisman connected to local network
- [ ] Wallet connected in UI
- [ ] Chain info displaying correctly
- [ ] Can create subscription
- [ ] Can update subscription
- [ ] Can request roles (with Premium subscription)
- [ ] Can submit spending proposals (as Mentor/Council)
- [ ] Can execute proposals (as Mentor/Council)

## Next Steps

After successful deployment and testing:

1. **Test Different Scenarios**:
   - Try all subscription types
   - Test role request flow
   - Test spending proposals
   - Test proposal execution

2. **Deploy to Testnet** (optional):
   - Update constants.ts with testnet RPC
   - Deploy contracts to testnet
   - Test with real testnet tokens

3. **Production Deployment**:
   - Audit smart contracts
   - Deploy to mainnet
   - Build production frontend (`npm run build`)
   - Deploy to hosting service (Vercel, Netlify, etc.)

## Useful Commands

```bash
# Check contract code hash
cargo contract build --release | grep "Code hash"

# Call contract method (read-only)
cargo contract call --contract <ADDRESS> --message <METHOD> --suri //Alice --dry-run

# Query contract storage
cargo contract call --contract <ADDRESS> --message <GETTER> --suri //Alice --dry-run

# Stop substrate node
# Press Ctrl+C in the terminal running the node
```

## Support

If you encounter issues:
1. Check the logs in substrate-contracts-node terminal
2. Check browser console for frontend errors
3. Verify all addresses and code hashes are correct
4. Try restarting the substrate node and redeploying

For more help, consult:
- [Substrate Contracts Documentation](https://use.ink/)
- [Polkadot.js API Documentation](https://polkadot.js.org/docs/)
- [Talisman Wallet Documentation](https://docs.talisman.xyz/)
