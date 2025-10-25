import { useState, useEffect, useCallback } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { getApi } from '../utils/contract';
import type { WalletAccount } from '../types';

export function useWallet() {
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<WalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);

  // Connect to Talisman wallet
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Enable the extension
      const extensions = await web3Enable('DAO DApp');

      if (extensions.length === 0) {
        throw new Error('No extension found. Please install Talisman wallet.');
      }

      // Get all accounts
      const allAccounts = await web3Accounts();

      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in Talisman.');
      }

      // Fetch balances for all accounts
      const apiInstance = await getApi();
      setApi(apiInstance);

      const accountsWithBalance = await Promise.all(
        allAccounts.map(async (account) => {
          const accountInfo: any = await apiInstance.query.system.account(account.address);
          return {
            ...account,
            balance: accountInfo.data.free.toString()
          };
        })
      );

      setAccounts(accountsWithBalance);

      // Auto-select first account if none selected
      if (!selectedAccount && accountsWithBalance.length > 0) {
        setSelectedAccount(accountsWithBalance[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [selectedAccount]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccounts([]);
    setSelectedAccount(null);
    setError(null);
  }, []);

  // Select a specific account
  const selectAccount = useCallback((account: WalletAccount) => {
    setSelectedAccount(account);
  }, []);

  // Get injector for signing transactions
  const getInjector = useCallback(async () => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }
    const injector = await web3FromAddress(selectedAccount.address);
    return injector;
  }, [selectedAccount]);

  // Refresh account balance
  const refreshBalance = useCallback(async () => {
    if (!selectedAccount) return;

    try {
      const api = await getApi();
      const accountInfo: any = await api.query.system.account(selectedAccount.address);

      setSelectedAccount(prev => prev ? {
        ...prev,
        balance: accountInfo.data.free.toString()
      } : null);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [selectedAccount]);

  // Initialize API on mount
  useEffect(() => {
    const initApi = async () => {
      const apiInstance = await getApi();
      setApi(apiInstance);
    };
    initApi();
  }, []);

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const extensions = await web3Enable('DAO DApp');
      if (extensions.length > 0) {
        await connectWallet();
      }
    };

    autoConnect();
  }, []);

  return {
    accounts,
    selectedAccount,
    isConnecting,
    error,
    api,
    connectWallet,
    disconnectWallet,
    selectAccount,
    getInjector,
    refreshBalance,
    isConnected: accounts.length > 0
  };
}
