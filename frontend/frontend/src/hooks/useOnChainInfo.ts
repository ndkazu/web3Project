import { useState, useEffect, useCallback } from 'react';
import { getApi } from '../utils/contract';
import type { ChainInfo } from '../types';

export function useOnChainInfo() {
  const [chainInfo, setChainInfo] = useState<ChainInfo>({
    blockNumber: 0,
    blockHash: '',
    connectedAccounts: 0,
    chainName: 'Loading...'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChainInfo = useCallback(async () => {
    try {
      const api = await getApi();

      // Get current block header
      const header = await api.rpc.chain.getHeader();
      const blockNumber = header.number.toNumber();
      const blockHash = header.hash.toHex();

      // Get chain name
      const chainName = await api.rpc.system.chain();

      // Get all accounts (this is a simplified version - you might want to track this differently)
      const accountKeys = await api.query.system.account.keys();
      const connectedAccounts = accountKeys.length;

      setChainInfo({
        blockNumber,
        blockHash,
        connectedAccounts,
        chainName: chainName.toString()
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chain info';
      setError(errorMessage);
      setIsLoading(false);
      console.error('Chain info fetch error:', err);
    }
  }, []);

  // Subscribe to new blocks
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const subscribeToBlocks = async () => {
      try {
        const api = await getApi();

        unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
          const blockNumber = header.number.toNumber();
          const blockHash = header.hash.toHex();

          // Get updated account count
          const accountKeys = await api.query.system.account.keys();
          const connectedAccounts = accountKeys.length;

          setChainInfo(prev => ({
            ...prev,
            blockNumber,
            blockHash,
            connectedAccounts
          }));
        });
      } catch (err) {
        console.error('Failed to subscribe to blocks:', err);
      }
    };

    fetchChainInfo();
    subscribeToBlocks();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchChainInfo]);

  return {
    chainInfo,
    isLoading,
    error,
    refetch: fetchChainInfo
  };
}
