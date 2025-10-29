"use client";
import { useState } from 'react';

export default function ProjectHubPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'stats' | 'opportunities' | 'documents' | 'disputes'>('feed');
  const [documents, setDocuments] = useState<{ name: string; visibility: string }[]>([]);

  const handleUploadDocument = () => {
    // Simulate upload
    const newDoc = { name: 'Progress Report.pdf', visibility: 'public' };
    setDocuments([...documents, newDoc]);
  };

  const feedItems = [
    { type: 'update', content: 'Solar panels installed successfully!', author: 'Project Manager', time: '2 hours ago' },
    { type: 'photo', content: 'New installation photo uploaded', author: 'Worker A', time: '1 day ago' },
    { type: 'milestone', content: '50% completion reached', author: 'System', time: '3 days ago' },
  ];

  const opportunities = [
    { title: 'Solar Technician Needed', description: 'Assist with panel installation', pay: '50 HHU/day' },
    { title: 'Maintenance Check', description: 'Monthly system inspection', pay: '30 HHU' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-saffron">Village Solar Project</h1>
            <div className="text-sm text-green bg-green/20 px-2 py-1 rounded inline-block">Live</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray">Status</div>
            <div className="text-sm">Active</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {['feed', 'stats', 'opportunities', 'documents', 'disputes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === tab ? 'bg-saffron text-navy' : 'bg-gray-600 text-light'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {feedItems.length > 0 ? (
            feedItems.map((item, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.content}</div>
                    <div className="text-sm text-gray">by {item.author}</div>
                  </div>
                  <div className="text-xs text-gray">{item.time}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="card text-center">
              <p className="text-gray">No updates yet — be the first to post a progress photo</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="card">
          <h3 className="font-semibold mb-4">Project Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>kWh Generated</span>
              <span className="font-bold text-saffron">12,450</span>
            </div>
            <div className="flex justify-between">
              <span>HHU Distributed</span>
              <span className="font-bold text-saffron">2,890</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue Generated</span>
              <span className="font-bold text-saffron">₹45,000</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="space-y-4">
          {opportunities.map((opp, index) => (
            <div key={index} className="card">
              <h4 className="font-semibold">{opp.title}</h4>
              <p className="text-sm text-gray">{opp.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-saffron font-medium">{opp.pay}</span>
                <button className="px-4 py-2 bg-saffron text-navy rounded-lg font-semibold">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="card flex justify-between items-center">
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-gray">Visibility: {doc.visibility}</div>
              </div>
              <button className="text-saffron">View</button>
            </div>
          ))}
          <button
            onClick={handleUploadDocument}
            className="w-full py-3 bg-saffron text-navy rounded-lg font-semibold"
          >
            Upload Document
          </button>
        </div>
      )}

      {activeTab === 'disputes' && (
        <div className="card text-center">
          <p className="text-gray">No disputes reported</p>
        </div>
      )}

      {/* Floating CTA */}
      <button className="fixed bottom-4 right-4 w-16 h-16 bg-saffron text-navy rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
        +
      </button>
    </div>
  );
}
