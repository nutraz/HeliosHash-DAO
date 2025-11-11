"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConnectWalletRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified login/connect flow
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Redirecting to Connect Wallet…</h2>
        <p className="text-gray-500">If you aren't redirected, <a href="/login" className="text-blue-600">click here</a>.</p>
      </div>
    </div>
  )
}
