import React, { useState } from 'react';
import { Loader, Send, XCircle, CheckCircle } from 'lucide-react';
import { SecurityService } from '@/lib/services/securityService';
import { ICPCanisterService } from '@/lib/services/icpService';

export const TokenTransfer: React.FC<{
  canisterService: ICPCanisterService;
  securityService: SecurityService;
  onSuccess: () => void;
}> = ({ canisterService, securityService, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    setError(null);
    setSuccess(false);

    const addressValidation = securityService.validateAddress(recipient);
    if (!addressValidation.valid) {
      setError(addressValidation.error || 'Invalid address');
      return;
    }

    const amountValidation = securityService.validateAmount(amount);
    if (!amountValidation.valid) {
      setError(amountValidation.error || 'Invalid amount');
      return;
    }

    setLoading(true);
    try {
      await canisterService.transferTokens(recipient, parseFloat(amount));
      setSuccess(true);
      setRecipient('');
      setAmount('');
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Send Tokens</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
          <input value={recipient} onChange={(e) => setRecipient(e.target.value)} disabled={loading}
            placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Amount (HHD)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} disabled={loading}
            placeholder="0.00"
            type="number"
            step="0.01"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2" />
        </div>

        {error && <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-3 flex items-center space-x-2"><XCircle className="text-red-400" size={20} /><span className="text-red-300 text-sm">{error}</span></div>}
        {success && <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-lg p-3 flex items-center space-x-2"><CheckCircle className="text-green-400" size={20} /><span className="text-green-300 text-sm">Transfer successful!</span></div>}

        <button onClick={handleTransfer} disabled={loading || !recipient || !amount}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
          {loading ? <><Loader className="animate-spin" size={20} /><span>Processing...</span></> : <><Send size={20} /><span>Send Tokens</span></>}
        </button>
      </div>
    </div>
  );
};

export default TokenTransfer;
