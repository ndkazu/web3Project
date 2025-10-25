// Contract configuration constants
export const CONTRACT_ADDRESS = '0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0'; // DAO contract with fixed gas limits
export const ERC20_ADDRESS = '0xb5c1704481358b8057507febdb5b8ea1dd0629b5'; // ERC20 token contract
export const GOVERNANCE_ADDRESS = '0xb2ecdfb581808e799e5cf0c6cbd3bc5359f11de0'; // Governance contract
export const WS_PROVIDER = 'ws://127.0.0.1:9944'; // Local substrate node

// Subscription types
export const SubscriptionType = {
  Free: 'Free',
  Basic: 'Basic',
  Premium: 'Premium',
  Other: 'Other'
} as const;

export type SubscriptionType = typeof SubscriptionType[keyof typeof SubscriptionType];

// Role types
export const Roles = {
  Mentor: 'Mentor',
  Council: 'Council'
} as const;

export type Roles = typeof Roles[keyof typeof Roles];

// Subscription amounts (matching contract values)
export const SUBSCRIPTION_AMOUNTS = {
  [SubscriptionType.Free]: 0,
  [SubscriptionType.Basic]: 1000,
  [SubscriptionType.Premium]: 5000,
  [SubscriptionType.Other]: 10000
};

// Block time constants
export const MINUTES = 20;
export const HOURS = MINUTES * 60;
export const DAYS = HOURS * 24;
