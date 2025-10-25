// Contract configuration constants
export const CONTRACT_ADDRESS = '0xf2095f6aa01f329d113c0ef984fc11d1f9932cab'; // DAO contract with fixed gas limits
export const ERC20_ADDRESS = '0x5801b439a678d9d3a68b8019da6a4abfa507de11'; // ERC20 token contract
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
