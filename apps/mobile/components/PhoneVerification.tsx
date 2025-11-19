import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PhoneVerificationProps {
  navigation: any;
}

export const PhoneVerification: React.FC<PhoneVerificationProps> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone.match(/^[6-9]\d{9}$/)) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    try {
      // API call to send OTP
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (response.ok) {
        setStep('otp');
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter 6-digit OTP');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      if (response.ok) {
        const user = await response.json();
        // Store user session and create wallet
        const walletResponse = await fetch('/api/wallet/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.user.id })
        });
        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          // Navigate to wallet screen with userId
          navigation.navigate('WalletScreen', { userId: user.user.id });
        } else {
          Alert.alert('Error', 'Failed to create wallet.');
        }
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <View style={{ flex: 1, backgroundColor: '#111827', padding: 24, justifyContent: 'center' }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#f3f4f6' }}>Phone Verification</Text>
  <Text style={{ color: '#9ca3af', marginBottom: 32 }}>
        We'll send a one-time code to your phone — only used to create your account
      </Text>
      {step === 'phone' ? (
        <>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#374151', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 18, backgroundColor: '#1f2937', color: '#f3f4f6' }}
            placeholder="Enter 10-digit phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
          <TouchableOpacity 
            style={{ backgroundColor: '#60a5fa', paddingVertical: 16, borderRadius: 8 }}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <Text style={{ color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={{ borderWidth: 1, borderColor: '#374151', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 18, textAlign: 'center', backgroundColor: '#1f2937', color: '#f3f4f6' }}
            placeholder="Enter 6-digit OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          <TouchableOpacity 
            style={{ backgroundColor: '#60a5fa', paddingVertical: 16, borderRadius: 8, marginBottom: 16 }}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <Text style={{ color: '#111827', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('phone')}>
            <Text style={{ color: '#60a5fa', textAlign: 'center' }}>Change Phone Number</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
