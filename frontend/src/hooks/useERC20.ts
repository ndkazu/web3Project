import { useState, useCallback, useEffect } from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import { useWallet } from './useWallet';
import { ERC20_ADDRESS, CONTRACT_ADDRESS } from '../utils/constants';
import erc20Abi from '../contracts/erc20.json';

export function useERC20() {
  const { selectedAccount, api, getInjector } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ContractPromise | null>(null);

  // Initialize ERC20 contract
  useEffect(() => {
    async function init() {
      if (!api) return;

      try {
        const erc20Contract = new ContractPromise(api, erc20Abi, ERC20_ADDRESS);
        setContract(erc20Contract);
        console.log('ERC20 contract initialized at:', ERC20_ADDRESS);
      } catch (err) {
        console.error('Failed to initialize ERC20 contract:', err);
      }
    }
    init();
  }, [api]);

  // Approve the DAO contract to spend tokens
  const approveDAO = useCallback(async (amount: bigint) => {
    if (!selectedAccount || !contract || !api) {
      throw new Error('Wallet not connected or contract not initialized');
    }

    setIsLoading(true);
    setError(null);

    return new Promise(async (resolve, reject) => {
      try {
        const injector = await getInjector();

        const gasLimit = api.registry.createType('WeightV2', {
          refTime: 100000000000,
          proofSize: 10000000
        }) as any;

        const storageDepositLimit = 500n * 1000000000000n;

        // Call approve on ERC20 contract, approving the DAO contract address
        const unsub = await contract.tx.approve(
          { gasLimit, storageDepositLimit },
          CONTRACT_ADDRESS, // spender (the DAO contract)
          amount // amount to approve
        ).signAndSend(
          selectedAccount.address,
          { signer: injector.signer },
          (result: any) => {
            console.log('ERC20 Approve transaction status:', result.status.toHuman());

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
                console.log('✅ ERC20 Approve successful!');
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
        console.error('ERC20 Approve error:', err);
        setError(errorMessage);
        setIsLoading(false);
        reject(err);
      }
    });
  }, [selectedAccount, contract, api, getInjector]);

  return {
    isLoading,
    error,
    contract,
    approveDAO
  };
}
