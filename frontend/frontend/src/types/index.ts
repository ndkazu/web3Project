import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export interface User {
  name: string;
  subscription: Subscription;
  mentor: boolean;
  council: boolean;
  institutional: boolean;
  school: boolean;
}

export interface Subscription {
  amount: bigint;
  start: number;
  end: number;
  active: boolean;
  subscriptionType: 'Free' | 'Basic' | 'Premium' | 'Other';
}

export interface ChainInfo {
  blockNumber: number;
  blockHash: string;
  connectedAccounts: number;
  chainName: string;
}

export interface WalletAccount extends InjectedAccountWithMeta {
  balance?: string;
}

export interface Proposal {
  id: number;
  description: string;
  proposalType: 'Spending' | 'NewMentor' | 'NewCouncilvoter';
  beneficiary?: string;
  amount?: bigint;
  active: boolean;
  owner: string;
}
