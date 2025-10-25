# How to Update Your Subscription

## Problem Fixed

The transaction was failing because the DAO contract was trying to transfer tokens using the wrong method. I've fixed the contract to use `transfer_from` which properly handles token transfers with approval.

## New Contract Deployment

- **New DAO Contract Address**: `0x356d441ae35d8c88284f6fd0f2cdba0b5e9ba353`
- **ERC20 Token Contract**: (instantiated inside DAO contract)
- **Frontend**: Updated with new contract address

## Steps to Update Your Subscription

### Important: Understanding ERC20 Approvals

When upgrading from Free to Basic (or any paid tier), you need to:

1. **Have enough tokens** - Get tokens from the faucet first
2. **Approve the DAO contract** - Allow the DAO to spend your tokens
3. **Update your subscription** - The DAO will then transfer the approved tokens

### Step-by-Step Process

#### Step 1: Get Tokens from the Faucet

1. Click the **"Faucet"** button in the navigation
2. Claim free tokens (typically 10,000 tokens)
3. Wait for the transaction to complete
4. Verify your balance has increased

#### Step 2: Approve the DAO Contract to Spend Your Tokens

**Option A: Using Polkadot.js Apps (Recommended for now)**

1. Go to https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/contracts
2. Find the ERC20 contract address (check contract instances)
3. Click on the ERC20 contract
4. Call the `approve` method with:
   - **spender**: `0x356d441ae35d8c88284f6fd0f2cdba0b5e9ba353` (DAO contract address)
   - **value**: A large number like `100000` (or the maximum amount you want to allow)
5. Sign and submit the transaction

**Option B: We can add an "Approve" button to the frontend**

I can add a button to the frontend that automatically approves the DAO contract before updating subscriptions. Let me know if you'd like me to implement this.

#### Step 3: Update Your Subscription

1. Go to the **"Membership"** page
2. Select "Update Plan"
3. Choose your desired tier (Basic, Premium, etc.)
4. Click "Update Membership"
5. Sign the transaction
6. Wait for confirmation

## Why This Happens

The ERC20 token standard requires explicit approval before a contract can transfer tokens on your behalf. This is a security feature that prevents unauthorized token transfers.

**Workflow:**
```
User (Alice) → Approves DAO contract → DAO contract can now transfer tokens from Alice
```

Without approval:
```
User (Alice) → Tries to update subscription → DAO tries to transfer → FAILS (no approval)
```

## Current Status

✅ Contract fixed to use `transfer_from`
✅ Contract redeployed at new address
✅ Frontend updated with new contract address
✅ Metadata copied to frontend
⏳ Need to approve DAO contract before updating subscription

## Next Steps

1. **Refresh your browser** to load the new contract address
2. **Get tokens from the faucet** if you haven't already
3. **Approve the DAO contract** to spend your tokens (see Step 2 above)
4. **Update your subscription** from Free to Basic

## Alternative Solution

I can modify the contract and frontend to make this process smoother by:
1. Adding an "Approve and Update" button that does both steps in one click
2. Or restructuring the payment flow to not require approvals

Would you like me to implement either of these solutions?
