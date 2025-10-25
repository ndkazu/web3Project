import { useState, useCallback, useEffect } from 'react';
import { getContract, getApi, stringToBytes } from '../utils/contract';
import { useWallet } from './useWallet';
import { SubscriptionType, Roles } from '../utils/constants';

export function useContract() {
  const { selectedAccount, getInjector, refreshBalance } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);

  // Initialize API and contract
  useEffect(() => {
    async function init() {
      try {
        const apiInstance = await getApi();
        const contractInstance = await getContract();
        setApi(apiInstance);
        setContract(contractInstance);
        console.log('Contract initialized successfully');
      } catch (err) {
        console.error('Failed to initialize contract:', err);
      }
    }
    init();
  }, []);

  // Create new subscription
  const createSubscription = useCallback(async (
    name: string,
    subscriptionType: SubscriptionType,
    institutional: boolean,
    school: boolean
  ) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const contract = await getContract();
        const injector = await getInjector();
        const api = await getApi();

        // IMPORTANT: Map the account first (required for Revive pallet)
        console.log('=== ACCOUNT MAPPING DEBUG ===');
        console.log('Account address:', selectedAccount.address);
        console.log('Account object:', selectedAccount);
        console.log('Mapping account for Revive pallet...');
        try {
          await api.tx.revive.mapAccount().signAndSend(
            selectedAccount.address,
            { signer: injector.signer }
          );
          console.log('✓ Account mapped successfully');
          // Wait a bit for the mapping to be included in a block
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (mapError: any) {
          // If mapping fails because account is already mapped, that's okay
          if (!mapError.message?.includes('AlreadyMapped')) {
            console.warn('Account mapping warning:', mapError.message);
          }
        }
        console.log('=== END MAPPING DEBUG ===');

        // Convert subscription type to enum format
        const subType = { [subscriptionType]: null };

        // Call contract method with increased gas limit
        const gasLimit = api.registry.createType('WeightV2', {
          refTime: 100000000000,
          proofSize: 10000000
        }) as any;

        // Set a reasonable storage deposit limit (500 tokens worth in planck units)
        const storageDepositLimit = 500n * 1000000000000n; // 500 tokens

        const unsub = await contract.tx.newSubscription(
          { gasLimit, storageDepositLimit },
          stringToBytes(name),
          subType,
          institutional,
          school
        ).signAndSend(
          selectedAccount.address,
          { signer: injector.signer },
          (result: any) => {
            console.log('Transaction status:', result.status.toHuman());

            if (result.status.isInBlock) {
              console.log(`✓ Transaction included in block ${result.status.asInBlock}`);

              // Check for errors in events
              let errorMessage = '';
              result.events.forEach(({ event }: any) => {
                console.log(`Event: ${event.section}.${event.method}`);

                if (api.events.system.ExtrinsicFailed.is(event)) {
                  const [dispatchError] = event.data;
                  if (dispatchError.isModule) {
                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                    errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
                  } else {
                    errorMessage = dispatchError.toString();
                  }
                  console.error('❌ Transaction FAILED:', errorMessage);
                }
              });

              if (errorMessage) {
                setIsLoading(false);
                if (unsub) unsub();
                reject(new Error(errorMessage));
              }
            }

            if (result.status.isFinalized) {
              console.log(`✓ Transaction finalized in block ${result.status.asFinalized}`);

              // Check for errors in the events
              const failedEvent = result.events.find((e: any) =>
                api.events.system.ExtrinsicFailed.is(e.event)
              );

              if (failedEvent) {
                console.error('Transaction failed at finalization');
                // Already handled in isInBlock, just clean up
                setIsLoading(false);
                if (unsub) unsub();
              } else {
                console.log('✅ Transaction successful!');
                setIsLoading(false);
                refreshBalance();
                if (unsub) unsub();
                resolve(result);
              }
            }

            if (result.isError) {
              console.error('Transaction error');
              setIsLoading(false);
              if (unsub) unsub();
              reject(new Error('Transaction error'));
            }
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
        console.error('Create subscription error:', err);
        setError(errorMessage);
        setIsLoading(false);
        reject(err);
      }
    });
  }, [selectedAccount, getInjector, refreshBalance]);

  // Update subscription
  const updateSubscription = useCallback(async (subscriptionType: SubscriptionType) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const injector = await getInjector();
      const api = await getApi();

      const subType = { [subscriptionType]: null };

      const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 }) as any;
      const storageDepositLimit = 500n * 1000000000000n;

      await contract.tx.updateSubscription(
        { gasLimit, storageDepositLimit },
        subType
      ).signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result) => {
          if (result.status.isFinalized) {
            setIsLoading(false);
            refreshBalance();
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [selectedAccount, getInjector, refreshBalance]);

  // Request role
  const requestRole = useCallback(async (role: Roles, description: string) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const injector = await getInjector();
      const api = await getApi();

      const roleEnum = { [role]: null };

      const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 }) as any;
      const storageDepositLimit = 500n * 1000000000000n;

      await contract.tx.requestRole(
        { gasLimit, storageDepositLimit },
        roleEnum,
        stringToBytes(description)
      ).signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result) => {
          if (result.status.isFinalized) {
            setIsLoading(false);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [selectedAccount, getInjector]);

  // Request spending proposal
  const requestSpending = useCallback(async (
    beneficiary: string,
    amount: bigint,
    description: string
  ) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const injector = await getInjector();
      const api = await getApi();

      const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 }) as any;
      const storageDepositLimit = 500n * 1000000000000n;

      await contract.tx.requestSpending(
        { gasLimit, storageDepositLimit },
        beneficiary,
        amount,
        stringToBytes(description)
      ).signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result) => {
          if (result.status.isFinalized) {
            setIsLoading(false);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [selectedAccount, getInjector]);

  // Execute proposal
  const executeProposal = useCallback(async (proposalId: number) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = await getContract();
      const injector = await getInjector();
      const api = await getApi();

      const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 }) as any;
      const storageDepositLimit = 500n * 1000000000000n;

      await contract.tx.executeProposal(
        { gasLimit, storageDepositLimit },
        proposalId
      ).signAndSend(
        selectedAccount.address,
        { signer: injector.signer },
        (result) => {
          if (result.status.isFinalized) {
            setIsLoading(false);
          }
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, [selectedAccount, getInjector]);

  // Approve DAO to spend tokens
  const approveDao = useCallback(async (amount: bigint) => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    setIsLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const contract = await getContract();
        const injector = await getInjector();
        const api = await getApi();

        const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 }) as any;
        const storageDepositLimit = 500n * 1000000000000n;

        const unsub = await contract.tx.approveDao(
          { gasLimit, storageDepositLimit },
          amount
        ).signAndSend(
          selectedAccount.address,
          { signer: injector.signer },
          (result: any) => {
            console.log('Approve DAO transaction status:', result.status.toHuman());

            if (result.status.isInBlock) {
              console.log(`✓ Transaction included in block ${result.status.asInBlock}`);

              // Check for errors in events
              let errorMessage = '';
              result.events.forEach(({ event }: any) => {
                console.log(`Event: ${event.section}.${event.method}`);

                if (api.events.system.ExtrinsicFailed.is(event)) {
                  const [dispatchError] = event.data;
                  if (dispatchError.isModule) {
                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                    errorMessage = `${decoded.section}.${decoded.name}: ${decoded.docs.join(' ')}`;
                  } else {
                    errorMessage = dispatchError.toString();
                  }
                  console.error('❌ Transaction FAILED:', errorMessage);
                }
              });

              if (errorMessage) {
                setIsLoading(false);
                if (unsub) unsub();
                reject(new Error(errorMessage));
              }
            }

            if (result.status.isFinalized) {
              console.log(`✓ Transaction finalized in block ${result.status.asFinalized}`);

              // Check for errors in the events
              const failedEvent = result.events.find((e: any) =>
                api.events.system.ExtrinsicFailed.is(e.event)
              );

              if (failedEvent) {
                console.error('Transaction failed at finalization');
                setIsLoading(false);
                if (unsub) unsub();
              } else {
                console.log('✅ Approve DAO successful!');
                setIsLoading(false);
                if (unsub) unsub();
                resolve(result);
              }
            }

            if (result.isError) {
              console.error('Transaction error');
              setIsLoading(false);
              if (unsub) unsub();
              reject(new Error('Transaction error'));
            }
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
        console.error('Approve DAO error:', err);
        setError(errorMessage);
        setIsLoading(false);
        reject(err);
      }
    });
  }, [selectedAccount, getInjector]);

  return {
    isLoading,
    error,
    api,
    contract,
    createSubscription,
    updateSubscription,
    requestRole,
    requestSpending,
    executeProposal,
    approveDao
  };
}
