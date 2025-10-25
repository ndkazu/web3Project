# Using the approve_dao Function

## Problem Solved

Instead of having to interact with the ERC20 contract separately to approve token spending, users can now approve the DAO contract directly through a single function call.

## New Contract Deployment

**New DAO Contract Address**: `0xc0d7aa0ed4193c0ba68448a00eb93049d690cdf0`

This contract includes the new `approve_dao` helper function.

## How to Use

### Option 1: Using the Contract Directly

Before updating your subscription from Free to Basic (or any paid tier), call the `approve_dao` function:

```bash
# Approve the DAO to spend 100,000 tokens (adjust amount as needed)
cargo contract call \
  --contract 0xc0d7aa0ed4193c0ba68448a00eb93049d690cdf0 \
  --message approve_dao \
  --args 100000 \
  --suri //Alice \
  -x
```

Then update your subscription:

```bash
# Update subscription to Basic
cargo contract call \
  --contract 0xc0d7aa0ed4193c0ba68448a00eb93049d690cdf0 \
  --message update_subscription \
  --args Basic \
  --suri //Alice \
  -x
```

### Option 2: Using Polkadot.js Apps

1. Go to https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/contracts
2. Find the DAO contract at `0xc0d7aa0ed4193c0ba68448a00eb93049d690cdf0`
3. Click "Execute" next to the DAO contract
4. Select the `approve_dao` method
5. Enter the amount: `100000` (or a large number to cover future subscriptions)
6. Sign and submit the transaction
7. Wait for confirmation
8. Now you can update your subscription through the frontend!

## Complete Workflow

1. **Get Tokens from Faucet**
   - Go to the Faucet page in the frontend
   - Claim 10,000 tokens

2. **Approve DAO Contract** (One-time step)
   - Use `approve_dao` function with a large amount (e.g., 100,000)
   - This allows the DAO to spend your tokens for subscriptions

3. **Update Your Subscription**
   - Go to Membership page
   - Select your desired tier (Basic, Premium, etc.)
   - Click "Update Membership"
   - The DAO contract will automatically transfer the required tokens

## Function Details

### approve_dao

```rust
pub fn approve_dao(&mut self, amount: U256) -> Result<(), Error>
```

**Parameters:**
- `amount`: The maximum number of tokens the DAO contract is allowed to spend on your behalf

**What it does:**
- Calls the ERC20 contract's `approve` method
- Grants the DAO contract permission to transfer tokens from your account
- You only need to call this once with a large enough amount to cover multiple subscription updates

**Recommended amount:**
- For basic testing: `100000`
- For production use: Calculate based on your expected subscription costs

## Benefits

✅ **Simpler workflow** - One function instead of interacting with two contracts
✅ **Better UX** - Can be integrated into the frontend
✅ **One-time approval** - Approve once, update subscription multiple times
✅ **Transparent** - Still uses the standard ERC20 approval mechanism

## Next Steps

The frontend can be updated to include an "Approve Tokens" button that calls this function before allowing subscription updates. This would make the entire process seamless for users.

Would you like me to add this button to the frontend?
