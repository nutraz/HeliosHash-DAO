const { execSync } = require('child_process');

console.log('🧪 Testing HHU Token Canister...\n');

try {
  // Check if canister is deployed
  console.log('1. Checking canister status...');
  const status = execSync('dfx canister status hhu_token', { encoding: 'utf8' });
  console.log('✅ Canister status:', status.split('\n')[0]);

  // Test balance query
  console.log('\n2. Testing balance query...');
  const balance = execSync("dfx canister call hhu_token balanceOf '(principal \"aaaaa-aa\")'", { encoding: 'utf8' });
  console.log('✅ Balance query result:', balance.trim());

  // Test proposal creation
  console.log('\n3. Testing proposal creation...');
  const proposal = execSync("dfx canister call hhu_token createProposal '(\"Test Proposal\", \"This is a test proposal\", 1000)'", { encoding: 'utf8' });
  console.log('✅ Proposal creation result:', proposal.trim());

  console.log('\n🎉 All tests attempted.');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('   - Local replica running: dfx start --background');
  console.log('   - Canisters deployed: dfx deploy');
}
