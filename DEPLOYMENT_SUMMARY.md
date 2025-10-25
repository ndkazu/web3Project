# Deployment Summary

**Date**: 2025-10-25

## Deployed Contracts

### 1. ERC20 Token Contract
- **Contract Address**: `0xb5c1704481358b8057507febdb5b8ea1dd0629b5`
- **Code Hash**: `0x5482c4cd758139eaebf1e0c5413b18ceaf0c54da6e9ae994fa333de2822edd67`
- **Initial Supply**: 1,000,000,000,000 tokens
- **Status**: Deployed successfully (instantiated by DAO contract)

### 2. Governance Contract
- **Contract Address**: `0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0`
- **Code Hash**: `0x7788fa424ec461f5074f3e929e965b77262380d0046a225c4add2303b94d2f03`
- **Quorum**: 50
- **Status**: Deployed successfully (instantiated by DAO contract)

### 3. Main DAO Contract
- **Contract Address**: `0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0`
- **Code Hash**: `0xf507971a13e3a79d05410ebc267360f0353f8a078f85588847a359d7e727b0c0`
- **ERC20 Instance**: `0xb5c1704481358b8057507febdb5b8ea1dd0629b5`
- **Governance Instance**: `0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0`
- **Status**: Deployed successfully

## Frontend Configuration

### Updated Files
- **[frontend/src/utils/constants.ts](frontend/src/utils/constants.ts#L2)**: Updated with DAO contract address
- **[frontend/public/metadata.json](frontend/public/metadata.json)**: Contract ABI copied successfully

## Deployment Details

All contracts were deployed to the local Substrate development node running at `ws://127.0.0.1:9944`.

The DAO contract automatically instantiates both ERC20 and Governance contracts using the code hashes specified in [lib.rs:107-108](lib.rs#L107-L108).

## Next Steps

1. **Start the frontend**:
   ```bash
   cd /home/kazu/Polkadot/my_edh/frontend
   npm run dev
   ```

2. **Access the application**:
   - Open your browser to `http://localhost:5173`
   - Connect your Talisman wallet
   - Ensure it's connected to the Local Node network

3. **Test the DAO functionality**:
   - Create a subscription
   - Update subscription tiers
   - Request roles (requires Premium subscription)
   - Submit and execute proposals (requires Mentor/Council role)

## Contract Interaction

You can interact with the deployed contracts using:

- **Frontend UI**: http://localhost:5173
- **Polkadot.js Apps**: https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944
- **cargo-contract CLI**: For direct contract calls

### Example CLI Call
```bash
cargo contract call \
  --contract 0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0 \
  --message get_my_subscription \
  --suri //Alice \
  --dry-run
```

## Important Notes

- The substrate node is running with `--tmp` flag, so all data will be cleared when the node stops
- Alice account was used for all deployments
- The code hashes in lib.rs match the deployed contracts
- All metadata has been properly copied to the frontend

## Verification

All deployment steps completed successfully:
- [x] ERC20 contract built and deployed
- [x] Governance contract built and deployed
- [x] Main DAO contract built and deployed
- [x] Metadata copied to frontend
- [x] Frontend constants updated with contract address

The DAO DApp is now ready for testing!
