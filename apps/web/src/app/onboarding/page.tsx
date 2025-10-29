"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const { completeOnboarding } = useAuth()
  const router = useRouter()

  const handleComplete = () => {
    completeOnboarding()
    router.push('/kyc')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <style jsx global>{`
        nav, header, [role="navigation"] {
          display: none !important;
        }
        body {
          background: #000 !important;
        }
      `}</style>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome to HeliosHash DAO</h1>
        
        <div className="space-y-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Complete your profile</h3>
              <p className="text-white/70 text-sm">Set up your personal information and preferences</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Set up your wallet</h3>
              <p className="text-white/70 text-sm">Connect your crypto wallet to start earning</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Learn about DAO governance</h3>
              <p className="text-white/70 text-sm">Understand how community decisions are made</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">4</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Explore earning opportunities</h3>
              <p className="text-white/70 text-sm">Discover tasks and projects to contribute to</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  )
}
