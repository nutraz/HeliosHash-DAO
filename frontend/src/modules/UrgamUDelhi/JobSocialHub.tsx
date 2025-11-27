'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  language?: string
}

const mockJobs = [
  { id: 'j1', title: 'Panel Installation - Baghpat', location: 'Baghpat, UP', budget: '₹12,50,000' },
  { id: 'j2', title: 'On-site Inspector', location: 'Delhi NCR', budget: '₹85,000' },
]

const mockFeed = [
  { id: 'p1', author: 'Priya', text: 'Baghpat grid 75% complete!' },
  { id: 'p2', author: 'Raj', text: 'Looking for labour for rooftop installs.' },
]

export default function JobSocialHub({ language = 'en' }: Props) {
  const [jobs] = useState(mockJobs)
  const [feed] = useState(mockFeed)

  const applyJob = (id: string) => {
    // TODO: wire to canister or offchain application flow
    alert(`${language === 'en' ? 'Applied to' : 'आवेदन किया'} ${id}`)
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Job Board' : 'नौकरी बोर्ड'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                  <div>
                    <div className="text-white font-semibold">{job.title}</div>
                    <div className="text-gray-400 text-sm">{job.location} • {job.budget}</div>
                  </div>
                  <div>
                    <Button onClick={() => applyJob(job.id)}>{language === 'en' ? 'Apply' : 'आवेदन करें'}</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === 'en' ? 'Social Feed' : 'सोशल फीड'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feed.map(post => (
                <div key={post.id} className="p-3 bg-gray-800 rounded">
                  <div className="text-sm text-gray-300"><strong>{post.author}:</strong> {post.text}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
