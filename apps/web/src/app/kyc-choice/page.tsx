"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function KYCChoicePage() {
  const router = useRouter();
  const { completeKYC } = useAuth();
  const [kycChoice, setKycChoice] = useState<'otp' | 'aadhaar' | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAcceptVerify = () => {
    if (consentAccepted) {
      // POST /kyc/start -> returns kyc_session_id
      console.log('Starting KYC flow');
      // Trigger UIDAI offline e-KYC flow
      // Placeholder: simulate file selection or QR scan
      alert('UIDAI offline e-KYC flow triggered');
      // Mark KYC as completed and redirect to dashboard
      completeKYC();
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    // Warn about feature limits
    alert('Skipping KYC will limit features like payouts > ₹5,000');
    // Still redirect to dashboard even if skipped
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center text-saffron">Verify your identity</h1>

      {/* KYC Choices */}
      <div className="space-y-4">
        <div
          className={`card cursor-pointer ${kycChoice === 'otp' ? 'border-saffron' : ''}`}
          onClick={() => setKycChoice('otp')}
        >
          <h3 className="font-semibold">Basic (OTP)</h3>
          <p className="text-sm text-gray">Verify with phone number</p>
        </div>
        <div
          className={`card cursor-pointer ${kycChoice === 'aadhaar' ? 'border-saffron' : ''}`}
          onClick={() => setKycChoice('aadhaar')}
        >
          <h3 className="font-semibold">Full (Aadhaar e-KYC + PAN)</h3>
          <p className="text-sm text-gray">Required for payouts {'>'} ₹5,000</p>
        </div>
      </div>

      {/* Aadhaar Consent Card */}
      {kycChoice === 'aadhaar' && (
        <div className="card space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              Paperless offline e-KYC. HHDAO will not store your Aadhaar number or raw biometrics. Only a hashed token and consent are kept. Required for payouts {'>'} ₹5,000 and landowner roles.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-saffron underline text-sm"
            >
              Learn more
            </button>
          </div>
          <div className="space-y-2">
            <input
              type="checkbox"
              id="aadhaar-consent"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="aadhaar-consent" className="text-sm">
              I consent to Aadhaar verification
            </label>
          </div>
          <button
            onClick={handleAcceptVerify}
            disabled={!consentAccepted}
            className={`w-full py-3 rounded-lg font-semibold ${
              consentAccepted ? 'bg-saffron text-navy' : 'bg-gray-600 text-gray cursor-not-allowed'
            }`}
          >
            Accept & Verify
          </button>
        </div>
      )}

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="w-full py-3 bg-transparent border border-gray-600 text-gray rounded-lg font-semibold"
      >
        Skip for now
      </button>

      {/* Modal for detailed privacy policy */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-sm mx-4">
            <h3 className="font-semibold mb-4">Privacy Policy Details</h3>
            <p className="text-sm mb-4">
              Detailed explanation of how Aadhaar data is handled securely without storing raw information.
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2 bg-saffron text-navy rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
