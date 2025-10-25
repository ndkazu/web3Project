// Contract configuration constants
export const CONTRACT_ADDRESS = '0x6dc84ddeffccb19ed5285cf3c3d7b03a57a9a4b1'; // Replace with actual deployed contract address
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
