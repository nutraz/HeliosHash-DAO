import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const WalletScreen = ({ route, navigation }: any) => {
  const { userId } = route.params || {};
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/wallet/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (response.ok) {
          const data = await response.json();
          setWallet(data.wallet);
        } else {
          throw new Error('Failed to create wallet');
        }
      } catch (err) {
        Alert.alert('Error', 'Could not create wallet.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchWallet();
  }, [userId]);

  const handleWithdraw = async () => {
    // Example: Withdraw 100 HHU to UPI
    setIsLoading(true);
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId: wallet._id, amount: 100, upiId: 'test@upi' })
      });
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Withdrawal Requested', `Transaction ID: ${data.transaction._id}`);
      } else {
        throw new Error('Withdrawal failed');
      }
    } catch (err) {
      Alert.alert('Error', 'Withdrawal failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !wallet) {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}><Text style={{ color: '#f3f4f6' }}>Loading wallet...</Text></View>;
  }

  return (
  <View style={{ flex: 1, padding: 24, backgroundColor: '#111827' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#f3f4f6' }}>Wallet</Text>
      <Text style={{ marginBottom: 16, color: '#9ca3af' }}>Address: {wallet.address}</Text>
      <Text style={{ marginBottom: 16, color: '#9ca3af' }}>HHU Balance: {wallet.hhuBalance}</Text>
      <Text style={{ marginBottom: 16, color: '#9ca3af' }}>INR Balance: {wallet.inrBalance}</Text>
      <TouchableOpacity style={{ backgroundColor: '#60a5fa', paddingVertical: 16, borderRadius: 8, marginBottom: 16 }} onPress={handleWithdraw}>
        <Text style={{ color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>Withdraw 100 HHU to UPI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletScreen;
