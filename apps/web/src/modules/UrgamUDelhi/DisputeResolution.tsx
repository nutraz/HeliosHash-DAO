'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  language?: string
}

export default function DisputeResolution({ language = 'en' }: Props) {
  const [disputeText, setDisputeText] = useState('')

  const fileDispute = async () => {
    // TODO: wire to Motoko canister (dispute_canister.fileDispute)
    alert(language === 'en' ? 'Dispute filed (mock)' : 'विवाद दर्ज किया गया (मॉक)')
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'File Dispute' : 'शिकायत दर्ज करें'}</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-3 bg-gray-900 text-white rounded"
            rows={6}
            placeholder={language === 'en' ? 'Describe the issue...' : 'समस्या का वर्णन करें...'}
            value={disputeText}
            onChange={(e) => setDisputeText(e.target.value)}
          />

          <div className="mt-4">
            <Button onClick={fileDispute}>{language === 'en' ? 'Submit' : 'जमा करें'}</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Active Disputes' : 'सक्रिय विवाद'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-400">{language === 'en' ? 'No active disputes (mock).' : 'कोई सक्रिय विवाद नहीं (मॉक)।'}</div>
        </CardContent>
      </Card>
    </div>
  )
}
