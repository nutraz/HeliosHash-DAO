'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  language?: string
}

export default function Governance({ language = 'en' }: Props) {
  const { user } = useAuth()

  const mockProposals = [
    { id: 'p1', title: 'Increase landowner payout share', status: 'Voting' },
    { id: 'p2', title: 'Grant funds for community center', status: 'Open' },
  ]

  const createProposal = () => {
    // TODO: wire to canister createProposal via @dfinity/agent
    alert(language === 'en' ? 'Create proposal (not wired yet)' : 'प्रस्ताव बनाएं (अभी वायर्ड नहीं)')
  }

  const vote = (id: string, choice: 'yes' | 'no') => {
    // TODO: wire vote call
    alert(`${language === 'en' ? 'Voted' : 'वोट दिया'} ${choice} on ${id}`)
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{language === 'en' ? 'Governance' : 'शासन'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProposals.map(p => (
              <div key={p.id} className="p-3 bg-gray-800 rounded flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{p.title}</div>
                  <div className="text-gray-400 text-sm">{p.status}</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => vote(p.id, 'yes')}>{language === 'en' ? 'Yes' : 'हाँ'}</Button>
                  <Button onClick={() => vote(p.id, 'no')}>{language === 'en' ? 'No' : 'नहीं'}</Button>
                </div>
              </div>
            ))}

            {((user as any)?.walletType === 'internet-identity') && (user as any)?.principal && (
              <div className="mt-4">
                {(user as any)?.role === 'trustee' ? (
                  <Button onClick={createProposal}>{language === 'en' ? 'Create Proposal' : 'प्रस्ताव बनाएं'}</Button>
                ) : (
                  <div className="text-sm text-gray-400">{language === 'en' ? 'Only trustees can create proposals' : 'केवल ट्रस्टी प्रस्ताव बना सकते हैं'}</div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
