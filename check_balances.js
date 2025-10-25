const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');

async function checkBalances() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  
  const aliceBalance = await api.query.system.account(alice.address);
  const bobBalance = await api.query.system.account(bob.address);
  
  console.log('\n=== Account Balances ===\n');
  console.log('Alice:', alice.address);
  console.log('  Free:', aliceBalance.data.free.toHuman());
  console.log('  Reserved:', aliceBalance.data.reserved.toHuman());
  console.log('  Frozen:', aliceBalance.data.frozen.toHuman());
  
  console.log('\nBob:', bob.address);
  console.log('  Free:', bobBalance.data.free.toHuman());
  console.log('  Reserved:', bobBalance.data.reserved.toHuman());
  console.log('  Frozen:', bobBalance.data.frozen.toHuman());
  
  await api.disconnect();
}

checkBalances().catch(console.error);
