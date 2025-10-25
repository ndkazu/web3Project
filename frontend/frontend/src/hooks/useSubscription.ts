import { useState, useEffect, useCallback } from 'react';
import { useWallet } from './useWallet';
import { useContract } from './useContract';

export interface SubscriptionStatus {
  hasSubscription: boolean;
  subscriptionType?: string;
  name?: string;
  isLoading: boolean;
  refresh: () => void;
}

export function useSubscription() {
  const { selectedAccount, isConnected } = useWallet();
  const { api, contract } = useContract();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasSubscription: false,
    isLoading: true,
    refresh: () => {},
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = useCallback(() => {
    console.log('Manually refreshing subscription status');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    async function fetchSubscription() {
      console.log('fetchSubscription called', {
        isConnected,
        hasAccount: !!selectedAccount,
        hasApi: !!api,
        hasContract: !!contract,
        refreshTrigger
      });

      if (!isConnected || !selectedAccount || !api || !contract) {
        console.log('Missing dependencies, skipping fetch');
        setSubscriptionStatus({
          hasSubscription: false,
          isLoading: false,
          refresh,
        });
        return;
      }

      try {
        setSubscriptionStatus(prev => ({ ...prev, isLoading: true }));

        console.log('Querying contract for user:', selectedAccount.address);

        // Query the contract for subscription data
        // Assuming there's a getter method like 'getSubscription' or 'getUserData'
        const { result, output } = await contract.query.getUser(
          selectedAccount.address,
          { gasLimit: api.registry.createType('WeightV2', {
            refTime: 100000000000,
            proofSize: 100000000000,
          }) },
          selectedAccount.address
        );

        console.log('Query result:', {
          result: result.toHuman(),
          output: output?.toHuman(),
          resultIsOk: result.isOk,
          hasOutput: !!output
        });

        if (result.isOk && output) {
          const userData = output.toHuman() as any;

          console.log('User data from contract:', userData);

          // The contract returns Option<User>, so check if it's Some variant
          if (userData && userData.Ok) {
            const user = userData.Ok;
            setSubscriptionStatus({
              hasSubscription: true,
              subscriptionType: user.subscription?.subscriptionType || 'Unknown',
              name: Array.isArray(user.name) ? String.fromCharCode(...user.name) : user.name,
              isLoading: false,
              refresh,
            });
          } else if (userData && userData.name) {
            // Fallback: direct user object (not wrapped in Option)
            setSubscriptionStatus({
              hasSubscription: true,
              subscriptionType: userData.subscription?.subscriptionType || userData.subscriptionType || 'Unknown',
              name: Array.isArray(userData.name) ? String.fromCharCode(...userData.name) : userData.name,
              isLoading: false,
              refresh,
            });
          } else {
            console.log('No user data found');
            setSubscriptionStatus({
              hasSubscription: false,
              isLoading: false,
              refresh,
            });
          }
        } else {
          console.log('Query failed or no output');
          // User doesn't exist or query failed
          setSubscriptionStatus({
            hasSubscription: false,
            isLoading: false,
            refresh,
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscriptionStatus({
          hasSubscription: false,
          isLoading: false,
          refresh,
        });
      }
    }

    fetchSubscription();
  }, [isConnected, selectedAccount, api, contract, refreshTrigger, refresh]);

  return subscriptionStatus;
}
