"use client";
import { useState } from 'react';

export default function CreateProposalPage() {
  const [step, setStep] = useState(1);
  const [proposalType, setProposalType] = useState<'financial' | 'protocol' | 'project'>('financial');
  const [title, setTitle] = useState('');
  const [tlDr, setTlDr] = useState('');
  const [details, setDetails] = useState('');
  const [treasuryAsk, setTreasuryAsk] = useState(0);
  const [timeline, setTimeline] = useState('');
  const [trusteeReview, setTrusteeReview] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  const costCalculator = (): number => {
    // Mock calculation
    return Math.max(100, treasuryAsk * 0.01);
  };

  const handleSummarize = () => {
    // AI-assist placeholder
    setTlDr('This proposal aims to improve solar efficiency by 20% through new technology adoption.');
  };

  const handleAttach = () => {
    // Simulate attachment
    setAttachments([...attachments, 'Document.pdf']);
  };

  const handleSubmit = () => {
    // POST /governance/proposals returns proposal_id
    console.log('Submitting proposal', { proposalType, title, tlDr, details, treasuryAsk, timeline, trusteeReview });
    alert('Proposal submitted for review');
  };

  const steps = [
    { id: 1, title: 'Type', completed: proposalType !== 'financial' },
    { id: 2, title: 'Title & TL;DR', completed: title && tlDr },
    { id: 3, title: 'Details + Attachments', completed: details },
    { id: 4, title: 'Treasury Ask & Timeline', completed: treasuryAsk > 0 && timeline },
    { id: 5, title: 'Review & Submit', completed: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex justify-between">
        {steps.map((s) => (
          <div key={s.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s.id ? 'bg-saffron text-navy' : 'bg-gray-600 text-light'
            }`}>
              {s.id}
            </div>
            <div className="text-xs mt-1 text-center">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Proposal Type</h3>
          <div className="space-y-2">
            {['financial', 'protocol', 'project'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={proposalType === type}
                  onChange={(e) => setProposalType(e.target.value as any)}
                  className="mr-2"
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Title & TL;DR</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Proposal Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
            <textarea
              placeholder="One sentence summary + 3 bullets of impact"
              value={tlDr}
              onChange={(e) => setTlDr(e.target.value)}
              className="w-full h-24"
            />
            <button onClick={handleSummarize} className="px-4 py-2 bg-gray-600 text-light rounded-lg">
              Summarize with AI
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Details & Attachments</h3>
          <div className="space-y-4">
            <textarea
              placeholder="Detailed proposal description"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full h-32"
            />
            <div>
              <button onClick={handleAttach} className="px-4 py-2 bg-saffron text-navy rounded-lg font-semibold">
                Attach Document
              </button>
              {attachments.map((att, index) => (
                <div key={index} className="text-sm text-gray mt-2">{att}</div>
              ))}
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={trusteeReview}
                onChange={(e) => setTrusteeReview(e.target.checked)}
                className="mr-2"
              />
              Require trustee review
            </label>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Treasury Ask & Timeline</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Treasury amount (HHU)"
              value={treasuryAsk}
              onChange={(e) => setTreasuryAsk(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="text"
              placeholder="Timeline (e.g., 3 months)"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="text-sm">Estimated Proposal Cost: {costCalculator()} HHU</div>
            <div className="text-xs text-gray">Recommended threshold: 500 HHU for large asks</div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Review & Submit</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Type:</strong> {proposalType}</div>
            <div><strong>Title:</strong> {title}</div>
            <div><strong>TL;DR:</strong> {tlDr}</div>
            <div><strong>Treasury Ask:</strong> {treasuryAsk} HHU</div>
            <div><strong>Timeline:</strong> {timeline}</div>
          </div>
          <button onClick={handleSubmit} className="w-full mt-4 py-3 bg-saffron text-navy rounded-lg font-semibold">
            Submit Proposal
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-600 text-light rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setStep(Math.min(5, step + 1))}
          disabled={step === 5}
          className="px-4 py-2 bg-saffron text-navy rounded-lg font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
}
