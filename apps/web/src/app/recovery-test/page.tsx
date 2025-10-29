"use client";
import { useState } from 'react';

export default function RecoveryTestPage() {
  const [step, setStep] = useState(1);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [testPassed, setTestPassed] = useState(false);
  const [socialRecovery, setSocialRecovery] = useState(false);
  const [guardians, setGuardians] = useState<string[]>([]);
  const [guardianInput, setGuardianInput] = useState('');

  const correctPhrase = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
  const wordOptions = ['abandon', 'about', 'ability', 'above', 'accept', 'access', 'account', 'action'];

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else if (selectedWords.length < 12) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleTestSubmit = () => {
    const enteredPhrase = selectedWords.join(' ');
    if (enteredPhrase === correctPhrase) {
      setTestPassed(true);
      alert('Recovery test passed!');
    } else {
      alert('Incorrect phrase. Try again.');
      setSelectedWords([]);
    }
  };

  const handleAddGuardian = () => {
    if (guardianInput && !guardians.includes(guardianInput)) {
      setGuardians([...guardians, guardianInput]);
      setGuardianInput('');
    }
  };

  const handleSetupSocialRecovery = () => {
    // POST /recovery/social-setup
    console.log('Setting up social recovery with guardians:', guardians);
    alert('Social recovery setup complete');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="card">
        <h1 className="text-xl font-bold text-center text-saffron">Social Recovery Test</h1>
        <p className="text-sm text-gray text-center">Verify your seed phrase and set up guardians</p>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? 'bg-saffron text-navy' : 'bg-gray-600 text-light'
            }`}>
              {s}
            </div>
            <div className="text-xs mt-1 text-center">
              {s === 1 ? 'Phrase' : s === 2 ? 'Test' : 'Guardians'}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Enter Recovery Phrase</h3>
          <textarea
            placeholder="Enter your 12-word seed phrase"
            value={recoveryPhrase}
            onChange={(e) => setRecoveryPhrase(e.target.value)}
            className="w-full h-24"
          />
          <p className="text-xs text-gray mt-2">
            This is stored locally and never sent to our servers. Used only for recovery setup.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Recovery Test</h3>
          <p className="text-sm text-gray mb-4">Select the words in the correct order:</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {wordOptions.map((word) => (
              <button
                key={word}
                onClick={() => handleWordSelect(word)}
                className={`py-2 px-3 rounded-lg text-sm font-medium ${
                  selectedWords.includes(word) ? 'bg-saffron text-navy' : 'bg-gray-600 text-light'
                }`}
              >
                {word}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray">Selected: {selectedWords.join(' ')}</p>
          </div>
          <button
            onClick={handleTestSubmit}
            disabled={selectedWords.length !== 12}
            className={`w-full py-3 rounded-lg font-semibold ${
              selectedWords.length === 12 ? 'bg-saffron text-navy' : 'bg-gray-600 text-gray cursor-not-allowed'
            }`}
          >
            Submit Test
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h3 className="font-semibold mb-4">Social Recovery Guardians</h3>
          <p className="text-sm text-gray mb-4">
            Add trusted friends or family who can help recover your account if you lose access.
          </p>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Guardian email"
                value={guardianInput}
                onChange={(e) => setGuardianInput(e.target.value)}
                className="flex-1"
              />
              <button onClick={handleAddGuardian} className="px-4 py-2 bg-saffron text-navy rounded-lg font-semibold">
                Add
              </button>
            </div>
            {guardians.map((guardian, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="text-sm">{guardian}</span>
                <button
                  onClick={() => setGuardians(guardians.filter(g => g !== guardian))}
                  className="text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={socialRecovery}
                onChange={(e) => setSocialRecovery(e.target.checked)}
                className="mr-2"
              />
              Enable social recovery
            </label>
            <button
              onClick={handleSetupSocialRecovery}
              disabled={!socialRecovery || guardians.length < 3}
              className={`w-full py-3 rounded-lg font-semibold ${
                socialRecovery && guardians.length >= 3 ? 'bg-saffron text-navy' : 'bg-gray-600 text-gray cursor-not-allowed'
              }`}
            >
              Setup Social Recovery
            </button>
          </div>
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
          onClick={() => setStep(Math.min(3, step + 1))}
          disabled={step === 3}
          className="px-4 py-2 bg-saffron text-navy rounded-lg font-semibold"
        >
          Next
        </button>
      </div>
    </div>
  );
}
