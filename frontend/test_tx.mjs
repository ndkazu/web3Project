import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { Keyring } from '@polkadot/keyring';
import { readFileSync } from 'fs';

const test = async () => {
  const api = await ApiPromise.create({ provider: new WsProvider('ws://127.0.0.1:9944') });
  const metadata = JSON.parse(readFileSync('public/metadata.json', 'utf8'));
  const contract = new ContractPromise(api, metadata, '0x6dc84ddeffccb19ed5285cf3c3d7b03a57a9a4b1');
  const alice = new Keyring({ type: 'sr25519' }).addFromUri('//Alice');
  
  console.log('Testing subscription creation with Alice...\n');
  
  const name = Array.from(new TextEncoder().encode('Alice Test'));
  const gasLimit = api.registry.createType('WeightV2', { refTime: 100000000000, proofSize: 10000000 });
  const storageDepositLimit = 500n * 1000000000000n;
  
  await new Promise((resolve, reject) => {
    contract.tx.newSubscription(
      { gasLimit, storageDepositLimit },
      name,
      { Free: null },
      false,
      false
    ).signAndSend(alice, (result) => {
      if (result.status.isInBlock) {
        const failed = result.events.find(e => api.events.system.ExtrinsicFailed.is(e.event));
        if (failed) {
          const [error] = failed.event.data;
          const decoded = error.isModule ? api.registry.findMetaError(error.asModule) : error.toString();
          console.error('❌ FAILED:', decoded.section ? `${decoded.section}.${decoded.name}` : decoded);
          reject(new Error(decoded.docs || decoded));
        } else {
          console.log('✅ SUCCESS in block');
        }
      }
      if (result.status.isFinalized) {
        console.log('✅ Finalized');
        resolve();
      }
    });
  });
  
  await api.disconnect();
  process.exit(0);
};

test().catch(e => { console.error('Error:', e.message); process.exit(1); });
