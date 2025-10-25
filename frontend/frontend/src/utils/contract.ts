import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { WS_PROVIDER, CONTRACT_ADDRESS } from './constants';

let apiInstance: ApiPromise | null = null;
let contractInstance: ContractPromise | null = null;

/**
 * Initialize and get the Polkadot API instance
 */
export async function getApi(): Promise<ApiPromise> {
  if (apiInstance && apiInstance.isConnected) {
    return apiInstance;
  }

  const wsProvider = new WsProvider(WS_PROVIDER);
  apiInstance = await ApiPromise.create({ provider: wsProvider });

  return apiInstance;
}

/**
 * Initialize and get the contract instance
 */
export async function getContract(): Promise<ContractPromise> {
  if (contractInstance) {
    return contractInstance;
  }

  const api = await getApi();

  // Fetch metadata from public folder
  const response = await fetch('/metadata.json');
  const metadata = await response.json();

  contractInstance = new ContractPromise(api, metadata, CONTRACT_ADDRESS);

  return contractInstance;
}

/**
 * Disconnect from the API
 */
export async function disconnectApi(): Promise<void> {
  if (apiInstance) {
    await apiInstance.disconnect();
    apiInstance = null;
    contractInstance = null;
  }
}

/**
 * Helper to convert string to bytes for contract calls
 */
export function stringToBytes(str: string): number[] {
  return Array.from(new TextEncoder().encode(str));
}

/**
 * Helper to convert bytes to string from contract responses
 */
export function bytesToString(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes));
}
