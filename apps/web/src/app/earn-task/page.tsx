"use client";
import { useState } from 'react';

export default function EarnTaskPage() {
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleQrScan = () => {
    // Simulate QR scan
    setQrScanned(true);
    alert('QR scanned successfully');
  };

  const handleManualEntry = () => {
    if (manualCode) {
      setQrScanned(true);
      alert('Manual code entered');
    }
  };

  const handlePhotoUpload = () => {
    setPhotoUploaded(true);
  };

  const handleCheckIn = () => {
    setCheckInDone(true);
  };

  const handleSubmit = () => {
    if (photoUploaded && checkInDone) {
      // POST /tasks/checkin with device_signature, encrypted_payload_hash
      console.log('Submitting check-in');
      // Client-side AES-256 encryption before upload
      // Store hash in canister
      alert('Check-in submitted successfully');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Task Header */}
      <div className="card">
        <h2 className="text-xl font-bold text-saffron">Solar Panel Installation</h2>
        <div className="flex justify-between text-sm">
          <span>50 HHU / ₹25</span>
          <span>Location: Village A</span>
        </div>
        <div className="text-xs text-gray">Due: Today 5 PM</div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-saffron">
            1
          </div>
          <div>
            <div className="font-medium">Confirm arrival</div>
            {!qrScanned && (
              <div className="space-y-2 mt-2">
                <button onClick={handleQrScan} className="w-full py-2 bg-saffron text-navy rounded-lg font-semibold">
                  Scan QR Code
                </button>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Manual code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="flex-1"
                  />
                  <button onClick={handleManualEntry} className="py-2 px-4 bg-gray-600 text-light rounded-lg">
                    Enter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-saffron">
            2
          </div>
          <div>
            <div className="font-medium">Take photo</div>
            <p className="text-xs text-gray">Wear PPE? Tap Yes and upload a quick photo</p>
            {!photoUploaded && (
              <button onClick={handlePhotoUpload} className="mt-2 py-2 px-4 bg-saffron text-navy rounded-lg font-semibold">
                Upload Photo
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-saffron">
            3
          </div>
          <div>
            <div className="font-medium">Supervisor signature</div>
            <button onClick={handleCheckIn} className="mt-2 py-2 px-4 bg-gray-600 text-light rounded-lg">
              Optional: Get Signature
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!photoUploaded || !checkInDone}
        className={`w-full py-3 rounded-lg font-semibold ${
          photoUploaded && checkInDone ? 'bg-saffron text-navy' : 'bg-gray-600 text-gray cursor-not-allowed'
        }`}
      >
        Submit Check-In
      </button>
    </div>
  );
}
