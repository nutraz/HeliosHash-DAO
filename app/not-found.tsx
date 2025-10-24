import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron/10 to-green/10">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-saffron mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-navy mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard"
            className="inline-block bg-saffron text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron/90 transition-colors"
          >
            Return to Dashboard
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>HeliosHash DAO - Powering Communities with Solar Energy</p>
          </div>
        </div>
      </div>
    </div>
  )
}
