"use client"

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AuthUser {
  authMethod: 'wallet' | 'phone' | 'aadhaar';
  phone?: string;
  walletType?: string;
  verified?: boolean;
  language?: 'en' | 'hi';
}

interface AuthSelectionProps {
  // Backward-compatible prop used across the app
  onAuthenticated: (userData: AuthUser) => void;
  // New optional, more explicit callback names
  onAuthSuccess?: (userData: AuthUser) => void;
  onError?: (error: Error) => void;
}

export default function AuthSelection({ onAuthenticated }: AuthSelectionProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [authMethod, setAuthMethod] = useState<'wallet' | 'phone' | 'aadhaar'>('wallet')

  const handlePhoneAuth = () => {
    setOtpSent(true)
    // TODO: Send OTP to phone
  }

  const handleOtpVerify = () => {
    // TODO: Verify OTP
    onAuthenticated({
      authMethod: 'phone',
      phone: phoneNumber,
      verified: true,
      language
    })
  }

  const handleWalletAuth = (wallet: string) => {
    // TODO: Connect wallet
    onAuthenticated({
      authMethod: 'wallet',
      walletType: wallet,
      verified: true,
      language
    })
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      {/* Web3 Connection Status */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">ICP Live</span>
        </div>
      </div>

      {/* Centered logo at top of auth screen */}
      <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-28 h-28 relative pointer-events-none">
          <Image src="/hhdaologo.svg" alt="HHDAO logo" fill className="object-contain" priority />
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Language Toggle */}
        <div className="flex justify-center space-x-4">
            <Button
            variant={language === 'en' ? 'default' : 'outline'}
            onClick={() => setLanguage('en')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            English
          </Button>
          <div className="mt-6 text-center">
            <Link href="/auth/multi" className="text-sm text-blue-400 hover:underline">Try Multi-Auth (developer preview)</Link>
          </div>
          <Button
            variant={language === 'hi' ? 'default' : 'outline'}
            onClick={() => setLanguage('hi')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            हिन्दी
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              {language === 'en' ? 'Welcome to HHDAO' : 'HHDAO में आपका स्वागत है'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {language === 'en'
                ? 'Choose your preferred authentication method'
                : 'अपनी पसंदीदा प्रमाणीकरण विधि चुनें'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Button
                variant={authMethod === 'wallet' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAuthMethod('wallet')}
              >
                Wallet
              </Button>
              <Button
                variant={authMethod === 'phone' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAuthMethod('phone')}
              >
                Phone
              </Button>
              <Button
                variant={authMethod === 'aadhaar' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setAuthMethod('aadhaar')}
              >
                Aadhaar
              </Button>
            </div>

            {authMethod === 'wallet' && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-blue-500"
                  onClick={() => handleWalletAuth('ii')}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <div className="font-semibold text-white">Internet Identity</div>
                      <div className="text-xs text-gray-400">ICP native auth</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-blue-500"
                  onClick={() => handleWalletAuth('metamask')}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🦊</span>
                    <div>
                      <div className="font-semibold text-white">MetaMask</div>
                      <div className="text-xs text-gray-400">EVM compatible</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-blue-500"
                  onClick={() => handleWalletAuth('plug')}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔌</span>
                    <div>
                      <div className="font-semibold text-white">Plug Wallet</div>
                      <div className="text-xs text-gray-400">ICP wallet</div>
                    </div>
                  </div>
                </Button>
              </div>
            )}

            {authMethod === 'phone' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handlePhoneAuth}
                      disabled={!phoneNumber}
                    >
                      {language === 'en' ? 'Send OTP' : 'OTP भेजें'}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        {language === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}
                      </label>
                      <Input
                        type="text"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="bg-gray-900 border-gray-700 text-white text-center text-2xl tracking-widest"
                      />
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handleOtpVerify}
                      disabled={otp.length !== 6}
                    >
                      {language === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें'}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-400"
                      onClick={() => setOtpSent(false)}
                    >
                      {language === 'en' ? 'Change Number' : 'नंबर बदलें'}
                    </Button>
                  </>
                )}
              </div>
            )}

            {authMethod === 'aadhaar' && (
              <div className="text-center py-8 space-y-4">
                <div className="text-4xl">🆔</div>
                <p className="text-gray-400">
                  {language === 'en'
                    ? 'Aadhaar e-KYC integration coming soon'
                    : 'आधार ई-केवाईसी एकीकरण जल्द आ रहा है'}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setAuthMethod('phone')}
                >
                  {language === 'en' ? 'Use Alternative Method' : 'वैकल्पिक विधि उपयोग करें'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          {language === 'en'
            ? 'By continuing, you agree to HHDAO Terms & Privacy Policy'
            : 'जारी रखने से, आप HHDAO की शर्तों और गोपनीयता नीति से सहमत हैं'}
        </p>
      </div>
    </div>
  )
}
