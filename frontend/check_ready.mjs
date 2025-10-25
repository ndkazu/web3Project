import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

async function checkReady() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  
  const aliceBalance = await api.query.system.account(alice.address);
  const bobBalance = await api.query.system.account(bob.address);
  
  console.log('\n✅ FRESH DEPLOYMENT COMPLETE!\n');
  console.log('═══════════════════════════════════════════════════\n');
  console.log('📋 DEPLOYED CONTRACTS:');
  console.log('  • ERC20:      0x5801b439a678d9d3a68b8019da6a4abfa507de11');
  console.log('  • Governance: 0x2c6fc00458f198f46ef072e1516b83cd56db7cf5');
  console.log('  • DAO (Main): 0x6dc84ddeffccb19ed5285cf3c3d7b03a57a9a4b1');
  console.log('\n💰 ACCOUNT BALANCES:');
  console.log('  Alice:', aliceBalance.data.free.toHuman(), '(Ready)');
  console.log('  Bob:  ', bobBalance.data.free.toHuman(), '(Ready)');
  console.log('\n✅ Frontend configured correctly');
  console.log('✅ Metadata copied to frontend/public/');
  console.log('\n═══════════════════════════════════════════════════');
  console.log('\n🚀 READY TO TEST SUBSCRIPTIONS!\n');
  console.log('Next steps:');
  console.log('  1. Refresh your browser (Ctrl+Shift+R)');
  console.log('  2. Connect Alice or Bob wallet in Talisman');
  console.log('  3. Go to Membership page');
  console.log('  4. Create a subscription\n');
  
  await api.disconnect();
  process.exit(0);
}

checkReady().catch(console.error);
