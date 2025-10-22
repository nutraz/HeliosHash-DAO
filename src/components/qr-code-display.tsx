'use client';

import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  title?: string;
  className?: string;
}

export default function QRCodeDisplay({
  url,
  size = 256,
  title = 'Scan to Access',
  className = '',
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError('');

        const qrCodeDataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });

        setQrCodeUrl(qrCodeDataUrl);
      } catch (err) {
        setError('Failed to generate QR code');
        console.error('QR Code generation error:', err);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [url, size]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center p-6 ${className}`}>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4'></div>
        <p className='text-gray-600'>Generating QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center p-6 ${className}`}>
        <div className='text-red-500 mb-2'>❌</div>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <h3 className='text-xl font-bold mb-4 text-gray-800'>{title}</h3>

      {qrCodeUrl && (
        <div className='relative'>
          <img
            src={qrCodeUrl}
            alt={`QR Code for ${url}`}
            className='rounded-lg shadow-md'
            width={size}
            height={size}
          />

          {/* Logo overlay in center */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='bg-white rounded-full p-2 shadow-md'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-xs'>HHDAO</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='mt-4 text-center'>
        <p className='text-sm text-gray-600 mb-2'>Scan with your device camera</p>
        <p className='text-xs text-gray-500 break-all max-w-xs'>{url}</p>
      </div>

      <div className='mt-4 flex gap-2'>
        <button
          onClick={() => navigator.clipboard?.writeText(url)}
          className='px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
        >
          Copy URL
        </button>

        <button
          onClick={() => {
            const link = document.createElement('a');
            link.download = 'hhdao-qrcode.png';
            link.href = qrCodeUrl;
            link.click();
          }}
          className='px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
        >
          Download QR
        </button>
      </div>
    </div>
  );
}
