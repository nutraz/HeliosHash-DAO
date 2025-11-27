import React from "react";
import { useRenderTrace } from '@/lib/useRenderTrace';

export const WalletPanel: React.FC<{
  balance: { ICP?: number; USDC?: number; INR?: number };
  onDeposit?: () => void;
  onWithdraw?: () => void;
}> = ({ balance, onDeposit, onWithdraw }) => {
  useRenderTrace('WalletPanel', { balance });
  return (
    <div className="bg-white/80 dark:bg-slate-900/70 rounded-xl p-4 shadow-sm">
      <h4 className="font-semibold">Wallet</h4>
      <div className="mt-3 flex gap-6">
        <div>
          <div className="text-xs text-gray-500">ICP</div>
          <div className="text-lg font-bold">{balance.ICP ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">USDC</div>
          <div className="text-lg font-bold">{balance.USDC ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">INR</div>
          <div className="text-lg font-bold">{balance.INR ?? 0}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="btn-primary" onClick={onDeposit}>Deposit</button>
        <button className="btn-secondary" onClick={onWithdraw}>Withdraw</button>
      </div>
    </div>
  );
};

export default WalletPanel;
