# Polkadot EDH (École des Hommes) - Smart Contract DAO

A decentralized autonomous organization (DAO) built with ink! smart contracts for the Polkadot/Substrate ecosystem. This project implements a membership-based DAO with governance capabilities, subscription management, and ERC20 token integration.

## 🌟 Features

- **Subscription Management**: Multiple tier subscriptions (Free, Basic, Premium, Other)
- **Token Integration**: Custom ERC20 token for payments and governance
- **Role-Based Access**: Mentor and Council roles with special privileges
- **Governance System**: Proposal creation, voting, and execution
- **Modern Frontend**: React + TypeScript with Polkadot.js integration
- **Smart Contracts**: Written in ink! for Substrate-based chains

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Smart Contracts](#smart-contracts)
- [Frontend Application](#frontend-application)
- [Deployment](#deployment)
- [Testing](#testing)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture

The project consists of three main smart contracts:

1. **EDH/DAO Contract** (`lib.rs`): Main contract managing members, subscriptions, and roles
2. **ERC20 Token Contract** (`other_contracts/my_erc20/`): Custom fungible token for payments
3. **Governance Contract** (`other_contracts/governance/`): Proposal and voting system

### Contract Addresses (Local Development)

- **EDH/DAO**: `0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0`
- **ERC20 Token**: `0xb5c1704481358b8057507febdb5b8ea1dd0629b5`
- **Governance**: `0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0`

## 🔧 Prerequisites

- **Rust**: Latest stable version
- **cargo-contract**: v4.0.0 or higher
- **Node.js**: v20.19+ or v22.12+
- **npm**: v10.5.2 or higher
- **Substrate Node**: Local development node or connection to a testnet

### Install Rust and cargo-contract

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install cargo-contract
cargo install cargo-contract --force
```

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/ndkazu/web3Project.git
cd web3Project
```

2. **Install frontend dependencies**

```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

3. **Build all smart contracts**

```bash
# Build EDH contract
cargo contract build --release

# Build ERC20 contract
cargo contract build --release --manifest-path other_contracts/my_erc20/Cargo.toml

# Build Governance contract
cargo contract build --release --manifest-path other_contracts/governance/Cargo.toml
```

## 📝 Smart Contracts

### EDH/DAO Contract

Main contract managing the DAO functionality:

- Create and manage user subscriptions
- Update subscription tiers
- Request and manage roles (Mentor, Council)
- Integration with ERC20 and Governance contracts

**Key Functions**:
- `new(supply: U256)`: Initialize the contract
- `new_subscription(name, subscription_type, institutional, school)`: Create a subscription
- `update_subscription(subscription_type)`: Upgrade/downgrade subscription
- `request_role(role)`: Request Mentor or Council role
- `get_my_subscription()`: Query user's subscription details

### ERC20 Token Contract

Standard ERC20 implementation with:
- Token transfers
- Allowance management
- Balance queries
- Total supply tracking

### Governance Contract

DAO governance features:
- Proposal creation
- Voting mechanism
- Proposal execution
- Quorum-based decision making

## 💻 Frontend Application

React + TypeScript application with:

- **Wallet Integration**: Polkadot.js, Talisman, SubWallet support
- **Subscription Management UI**: Create and manage subscriptions
- **Governance Interface**: Submit and vote on proposals
- **Token Faucet**: Claim test tokens
- **Responsive Design**: Mobile-friendly UI

### Running the Frontend

```bash
cd frontend
npm run dev
```

Access the application at: http://localhost:5173

## 🚀 Deployment

### 1. Start a Local Substrate Node

```bash
# Using substrate-contracts-node
substrate-contracts-node --dev --tmp
```

### 2. Deploy Contracts

```bash
# Upload and instantiate EDH contract (includes ERC20 and Governance)
cargo contract instantiate \
  --manifest-path Cargo.toml \
  --suri //Alice \
  --url ws://localhost:9944 \
  --execute \
  --args 1000000000000 \
  --skip-confirm
```

The EDH contract will automatically instantiate the ERC20 and Governance contracts.

### 3. Update Frontend Configuration

Update `frontend/src/utils/constants.ts` with deployed contract addresses:

```typescript
export const CONTRACT_ADDRESS = '0x...'; // EDH contract address
export const ERC20_ADDRESS = '0x...';    // ERC20 contract address
export const GOVERNANCE_ADDRESS = '0x...'; // Governance contract address
```

### 4. Copy Contract Metadata

```bash
cp target/ink/my_edh.json frontend/public/metadata.json
cp other_contracts/my_erc20/target/ink/my_erc20.json frontend/src/contracts/erc20.json
cp other_contracts/governance/target/ink/governance.json frontend/src/contracts/dao.json
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

## 🧪 Testing

### Test Smart Contracts

```bash
# Test EDH contract
cargo test

# Test ERC20 contract
cargo test --manifest-path other_contracts/my_erc20/Cargo.toml

# Test Governance contract
cargo test --manifest-path other_contracts/governance/Cargo.toml
```

### Test with Frontend

1. Start the local node
2. Deploy contracts
3. Start the frontend
4. Connect wallet (use Alice, Bob, or Charlie test accounts)
5. Test features:
   - Claim tokens from faucet
   - Create a subscription
   - Update subscription tier
   - Request roles
   - Create and vote on proposals

## 📖 Usage

### Creating a Subscription

1. Navigate to the Membership page
2. Select a subscription tier:
   - **Free**: No cost, basic access
   - **Basic**: 1,000 tokens, standard features
   - **Premium**: 5,000 tokens, full access + role eligibility
   - **Other**: 10,000 tokens, custom tier
3. Fill in your details
4. Confirm the transaction

### Requesting a Role

1. Have a Premium subscription
2. Navigate to Membership page
3. Click "Request Role"
4. Select Mentor or Council
5. Wait for approval

### Governance

1. Navigate to Governance page
2. View active proposals
3. Create new proposals (requires Mentor/Council role)
4. Vote on proposals
5. Execute approved proposals

## 📁 Project Structure

```
my_edh/
├── lib.rs                          # Main EDH/DAO contract
├── Cargo.toml                      # EDH contract dependencies
├── other_contracts/
│   ├── my_erc20/                   # ERC20 token contract
│   │   ├── lib.rs
│   │   └── Cargo.toml
│   └── governance/                 # Governance contract
│       ├── lib.rs
│       └── Cargo.toml
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── utils/                 # Utilities and constants
│   │   └── contracts/             # Contract metadata
│   ├── public/
│   │   └── metadata.json          # EDH contract ABI
│   ├── package.json
│   └── vite.config.ts
├── DEPLOYMENT_GUIDE.md            # Detailed deployment instructions
├── DEPLOYMENT_SUMMARY.md          # Latest deployment info
├── GETTING_STARTED.md             # Quick start guide
├── PROJECT_SUMMARY.md             # Project overview
└── README.md                      # This file
```

## 🛠️ Development

### Build Commands

```bash
# Build all contracts
cargo contract build --release

# Build specific contract
cargo contract build --release --manifest-path other_contracts/my_erc20/Cargo.toml

# Check contracts without building
cargo check
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Resources

- [ink! Documentation](https://use.ink/)
- [Polkadot.js Documentation](https://polkadot.js.org/docs/)
- [Substrate Documentation](https://docs.substrate.io/)
- [cargo-contract](https://github.com/paritytech/cargo-contract)

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check the [documentation files](GETTING_STARTED.md)
- Review the [deployment guide](DEPLOYMENT_GUIDE.md)

---

**Built with ink! for the Polkadot ecosystem**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
