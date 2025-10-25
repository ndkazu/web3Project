# DAO DApp Frontend

A React-based frontend application for interacting with the DAO smart contract on Polkadot.

## Features

- **Wallet Integration**: Connect with Talisman wallet
- **Real-time Chain Info**: Display block number, block hash, and connected accounts
- **Subscription Management**: Create and upgrade DAO subscriptions (Free, Basic, Premium, Other)
- **Governance**:
  - Request roles (Mentor, Council)
  - Submit spending proposals
  - Execute approved proposals
- **Responsive UI**: Built with TailwindCSS

## Prerequisites

Before running the frontend, ensure you have:

1. **Node.js** (v20.13.1 or higher)
2. **npm** or **yarn**
3. **Talisman Wallet** browser extension installed
4. **Local Substrate Node** running on `ws://127.0.0.1:9944`
5. **Deployed Contract**: Your DAO contract must be deployed on the local network

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

## Configuration

1. Update the contract address in `src/utils/constants.ts`:
```typescript
export const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE';
```

2. (Optional) If your node is running on a different port, update `WS_PROVIDER` in the same file:
```typescript
export const WS_PROVIDER = 'ws://127.0.0.1:9944'; // Change if needed
```

## Running the Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Deployment Steps

### 1. Start Local Substrate Node

First, ensure your local substrate contracts node is running:

```bash
# If using substrate-contracts-node
substrate-contracts-node --dev --tmp
```

### 2. Deploy the Smart Contract

Navigate to the contract directory and deploy:

```bash
cd /home/kazu/Polkadot/my_edh
cargo contract build --release

# Deploy using cargo-contract or Contracts UI
cargo contract instantiate --constructor new --args <SUPPLY> --suri //Alice
```

**Important**: Note the deployed contract address from the output!

### 3. Configure Talisman Wallet

1. Open Talisman wallet extension
2. Add a local network connection:
   - Network: `Local Node`
   - RPC URL: `ws://127.0.0.1:9944`
3. Import or create accounts with funds (use `//Alice`, `//Bob` for development)
4. Fund accounts if needed (transfer from Alice or use Faucet)

### 4. Update Contract Address

Copy the deployed contract address and update `frontend/src/utils/constants.ts`:

```typescript
export const CONTRACT_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Your address
```

### 5. Start the Frontend

```bash
cd frontend
npm run dev
```

### 6. Connect Wallet

1. Open the application in your browser
2. Click "Connect Wallet" in the header
3. Approve the connection in Talisman
4. Select your account from the dropdown (if you have multiple)

## Usage Guide

### Creating a Subscription

1. Navigate to the "Subscription Management" section
2. Fill in:
   - Name
   - Subscription Type (Free, Basic, Premium, Other)
   - Optional: Check "Institutional Account" or "School Account"
3. Click "Create Subscription"
4. Approve the transaction in Talisman

**Note**: Non-Free subscriptions require token payment:
- Basic: 1000 tokens
- Premium: 5000 tokens
- Other: 10000 tokens

### Requesting a Role

1. Go to "Governance" → "Request Role" tab
2. Select role type (Mentor or Council)
3. Write a description explaining why you should be granted the role
4. Click "Submit Role Request"

**Requirements**:
- Must have Premium subscription
- Request will be submitted as a proposal for voting

### Requesting Spending

1. Go to "Governance" → "Request Spending" tab
2. Fill in:
   - Beneficiary Address
   - Amount (in smallest unit)
   - Description
3. Click "Submit Spending Request"

**Requirements**: Must be a Council member or Mentor

### Executing Proposals

1. Go to "Governance" → "Execute Proposal" tab
2. Enter the Proposal ID
3. Click "Execute Proposal"

**Requirements**:
- Must be a Council member or Mentor
- Proposal must be approved by governance contract

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Wallet & chain info display
│   │   ├── SubscriptionCard.tsx    # Subscription management
│   │   └── GovernancePanel.tsx     # Governance features
│   ├── hooks/
│   │   ├── useWallet.ts            # Wallet connection logic
│   │   ├── useOnChainInfo.ts       # Chain data fetching
│   │   └── useContract.ts          # Contract interactions
│   ├── utils/
│   │   ├── constants.ts            # Configuration constants
│   │   └── contract.ts             # Contract utilities
│   ├── types/
│   │   └── index.ts                # TypeScript types
│   ├── App.tsx                     # Main application
│   └── main.tsx                    # Entry point
├── public/
│   └── metadata.json               # Contract ABI/metadata
├── package.json
└── README.md
```

## Troubleshooting

### Wallet Connection Issues

**Problem**: "No extension found" error
- **Solution**: Install Talisman wallet extension and refresh the page

**Problem**: "No accounts found" error
- **Solution**: Create or import accounts in Talisman wallet

### Contract Interaction Issues

**Problem**: Transactions failing
- **Solution**:
  - Ensure your account has sufficient balance
  - Verify contract address is correct
  - Check that the local node is running

**Problem**: "Contract not found" error
- **Solution**: Verify the contract is deployed and the address in `constants.ts` is correct

### Chain Connection Issues

**Problem**: Can't connect to local node
- **Solution**:
  - Verify substrate node is running on `ws://127.0.0.1:9944`
  - Check firewall settings
  - Try restarting the node

### Build Issues

**Problem**: Peer dependency conflicts
- **Solution**: Use `--legacy-peer-deps` flag when installing packages

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Polkadot.js** - Blockchain interaction
- **Talisman Connect** - Wallet integration
- **TailwindCSS** - Styling

## Contract Functions

The frontend interacts with these contract methods:

- `new_subscription(name, subscriptionType, institutional, school)` - Create new subscription
- `update_subscription(subscriptionType)` - Upgrade subscription
- `request_role(role, description)` - Request Mentor/Council role
- `request_spending(beneficiary, amount, description)` - Submit spending proposal
- `execute_proposal(proposalId)` - Execute approved proposal

## License

[Your License Here]

## Support

For issues or questions, please open an issue on the GitHub repository.
