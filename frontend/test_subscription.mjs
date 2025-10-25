import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { Keyring } from '@polkadot/keyring';
import { readFileSync } from 'fs';

async function testSubscription() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const metadata = JSON.parse(readFileSync('public/metadata.json', 'utf8'));
  const contract = new ContractPromise(api, metadata, '0x6dc84ddeffccb19ed5285cf3c3d7b03a57a9a4b1');
  
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  
  console.log('Testing subscription creation...\n');
  
  const name = Array.from(new TextEncoder().encode('Alice Test'));
  const subscriptionType = { Free: null };
  
  const gasLimit = api.registry.createType('WeightV2', { 
    refTime: 100000000000, 
    proofSize: 10000000 
  });
  
  const storageDepositLimit = 500n * 1000000000000n;
  
  console.log('Sending transaction with:');
  console.log('  - Gas limit:', gasLimit.toHuman());
  console.log('  - Storage limit:', storageDepositLimit.toString());
  console.log('  - Name:', new TextDecoder().decode(new Uint8Array(name)));
  console.log('  - Type: Free\n');
  
  try {
    await new Promise((resolve, reject) => {
      contract.tx.newSubscription(
        { gasLimit, storageDepositLimit },
        name,
        subscriptionType,
        false,
        false
      ).signAndSend(alice, (result) => {
        console.log('Status:', result.status.type);
        
        if (result.status.isInBlock) {
          console.log('✓ In block');
          
          let hasError = false;
          result.events.forEach(({ event }) => {
            if (api.events.system.ExtrinsicFailed.is(event)) {
              hasError = true;
              const [dispatchError] = event.data;
              let errorInfo;
              
              if (dispatchError.isModule) {
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
              } else {
                errorInfo = dispatchError.toString();
              }
              
              console.error('\n❌ TRANSACTION FAILED:', errorInfo);
              reject(new Error(errorInfo));
            }
          });
          
          if (!hasError) {
            console.log('✓ Transaction succeeded!');
          }
        }
        
        if (result.status.isFinalized) {
          console.log('✓ Finalized\n');
          console.log('✅ SUCCESS! Subscription created.');
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
  
  await api.disconnect();
  process.exit(0);
}

testSubscription().catch(console.error);
