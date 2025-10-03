import { HHDAOLogo } from '@/components/hhdao-logo';
import QRCodeDisplay from '@/components/qr-code-display';

export default function QRCodePage() {
  // Get the current URL - in development it's localhost:3000
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4'>
      <div className='container mx-auto max-w-4xl'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <HHDAOLogo className='w-16 h-16 mr-4' />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>
              HeliosHash DAO
            </h1>
          </div>
          <p className='text-gray-600 text-lg'>Solar Energy Infrastructure DAO</p>
        </div>

        {/* QR Code Section */}
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          {/* QR Code */}
          <div className='flex justify-center'>
            <QRCodeDisplay
              url={appUrl}
              size={300}
              title='Access HeliosHash DAO'
              className='max-w-sm'
            />
          </div>

          {/* Information Panel */}
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>🌞 Welcome to HeliosHash DAO</h2>

            <div className='space-y-4 text-gray-600'>
              <div className='flex items-start gap-3'>
                <span className='text-2xl'>🗳️</span>
                <div>
                  <h3 className='font-semibold text-gray-800'>Democratic Governance</h3>
                  <p className='text-sm'>
                    Participate in solar project decisions with 60% consensus voting
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <span className='text-2xl'>☀️</span>
                <div>
                  <h3 className='font-semibold text-gray-800'>Solar Projects</h3>
                  <p className='text-sm'>
                    Fund and manage renewable energy infrastructure in India
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <span className='text-2xl'>⚖️</span>
                <div>
                  <h3 className='font-semibold text-gray-800'>Dispute Resolution</h3>
                  <p className='text-sm'>Fair mediation system for project conflicts</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <span className='text-2xl'>📊</span>
                <div>
                  <h3 className='font-semibold text-gray-800'>Real-time Telemetry</h3>
                  <p className='text-sm'>Monitor solar panel performance and energy production</p>
                </div>
              </div>
            </div>

            <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg'>
              <h4 className='font-semibold text-gray-800 mb-2'>System Status</h4>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <div className='flex justify-between'>
                  <span>Backend:</span>
                  <span className='text-green-600 font-semibold'>✅ Online</span>
                </div>
                <div className='flex justify-between'>
                  <span>Canisters:</span>
                  <span className='text-green-600 font-semibold'>7/7 Active</span>
                </div>
                <div className='flex justify-between'>
                  <span>Network:</span>
                  <span className='text-blue-600 font-semibold'>IC Local</span>
                </div>
                <div className='flex justify-between'>
                  <span>Frontend:</span>
                  <span className='text-green-600 font-semibold'>✅ Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className='mt-12 bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-xl font-bold mb-4 text-gray-800'>📱 How to Access</h3>
          <div className='grid md:grid-cols-3 gap-4 text-sm'>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl mb-2'>📱</div>
              <h4 className='font-semibold mb-1'>Mobile Device</h4>
              <p className='text-gray-600'>Open camera app and scan the QR code above</p>
            </div>

            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl mb-2'>💻</div>
              <h4 className='font-semibold mb-1'>Desktop</h4>
              <p className='text-gray-600'>Visit localhost:3000 in your browser</p>
            </div>

            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl mb-2'>🔗</div>
              <h4 className='font-semibold mb-1'>Share</h4>
              <p className='text-gray-600'>Copy URL or download QR code to share</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-8 text-center text-gray-500 text-sm'>
          <p>Built on Internet Computer • Motoko Backend • React Frontend</p>
          <p className='mt-1'>Part of the One World Project ecosystem</p>
        </div>
      </div>
    </div>
  );
}
