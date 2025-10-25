import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { Keyring } from '@polkadot/keyring';
import { readFileSync } from 'fs';

async function testRealTransaction() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const metadata = JSON.parse(readFileSync('../target/ink/my_edh.json', 'utf8'));
  const contract = new ContractPromise(api, metadata, '0x6dc84ddeffccb19ed5285cf3c3d7b03a57a9a4b1');
  
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  
  console.log('Testing REAL subscription creation...');
  
  const name = Array.from(new TextEncoder().encode('Alice AI'));
  const subscriptionType = { Free: null };
  
  try {
    const gasLimit = api.registry.createType('WeightV2', { 
      refTime: 100000000000, 
      proofSize: 10000000 
    });
    
    console.log('Sending transaction...');
    
    await new Promise((resolve, reject) => {
      contract.tx.newSubscription(
        { gasLimit, storageDepositLimit: null },
        name,
        subscriptionType,
        false,
        false
      ).signAndSend(alice, (result) => {
        console.log('Status:', result.status.type);
        
        if (result.status.isInBlock) {
          console.log('In block:', result.status.asInBlock.toHex());
          
          // Check for errors
          result.events.forEach(({ event }) => {
            console.log(`Event: ${event.section}.${event.method}`);
            
            if (api.events.system.ExtrinsicFailed.is(event)) {
              const [dispatchError] = event.data;
              let errorInfo;
              
              if (dispatchError.isModule) {
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
              } else {
                errorInfo = dispatchError.toString();
              }
              
              console.error('❌ Transaction failed:', errorInfo);
              reject(new Error(errorInfo));
            }
          });
        }
        
        if (result.status.isFinalized) {
          console.log('✅ Finalized in block:', result.status.asFinalized.toHex());
          resolve(result);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await api.disconnect();
}

testRealTransaction().catch(console.error);
