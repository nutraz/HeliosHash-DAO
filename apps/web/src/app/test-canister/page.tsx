"use client"

import { useHHDAO } from '@/hooks/useHHDAO'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function TestCanisterPage() {
  const { dashboardData, projects, loading, error, refetch, getCyclesBalance } = useHHDAO()

  const handleTestCycles = async () => {
    try {
      const balance = await getCyclesBalance()
      alert(`Cycles Balance: ${balance}`)
    } catch (_err) {
      alert(`Error: ${_err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">🚀 HeliosHash DAO - Live Canister Test</h1>

        {/* Status Card */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                  Connecting to ICP Canister...
                </>
              ) : error ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Connection Error
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Connected to Internet Computer
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-300">
              <p><strong>Canister ID:</strong> {process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID}</p>
              <p><strong>Network:</strong> {process.env.NEXT_PUBLIC_IC_HOST}</p>
              <p><strong>Status:</strong> {error ? 'Error' : loading ? 'Loading' : 'Connected'}</p>
            </div>
            <div className="mt-4 space-x-2">
              <Button onClick={refetch} disabled={loading}>
                Refresh Data
              </Button>
              <Button onClick={handleTestCycles} variant="outline">
                Test Cycles Balance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Data */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">📊 Dashboard Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Projects:</strong> {dashboardData.projects?.length || 0}</p>
                  <p><strong>Documents:</strong> {dashboardData.documents?.length || 0}</p>
                  <p><strong>Devices:</strong> {dashboardData.devices?.length || 0}</p>
                  <p><strong>User Profile:</strong> {dashboardData.userProfile?.[0] ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">🏗️ Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projects?.slice(0, 3).map((project: any, index: number) => (
                    <div key={index} className="text-gray-300 p-2 bg-gray-700 rounded">
                      <p className="font-medium">{project.title || `Project ${index + 1}`}</p>
                      <p className="text-sm text-gray-400">{project.description?.substring(0, 50)}...</p>
                    </div>
                  )) || <p className="text-gray-400">No projects found</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mt-6 bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-400">❌ Error Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-300 text-sm whitespace-pre-wrap">{error}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}