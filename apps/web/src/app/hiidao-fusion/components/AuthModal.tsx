"use client";

import { useEffect, useRef, useState } from 'react';
import { connectInternetIdentity, connectPlug, connectStoic, connectNFID, AuthResult } from './providers';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: AuthResult) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Focus first element when modal opens
      const firstInput = modalRef.current?.querySelector('input, button');
      if (firstInput) {
        (firstInput as HTMLElement).focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProvider = async (provider: 'internet-identity' | 'plug' | 'stoic' | 'nfid' | 'password') => {
    setError(null);
    setLoadingMethod(provider);
    try {
      let result: AuthResult | undefined;
      if (provider === 'internet-identity') result = await connectInternetIdentity();
      if (provider === 'plug') result = await connectPlug();
      if (provider === 'stoic') result = await connectStoic();
      if (provider === 'nfid') result = await connectNFID();
      if (provider === 'password') {
        // Fallback: create a small local session for demo
        result = { method: 'password', principal: 'local-pass-user', name: 'local_user' };
      }

      if (result) {
        onSuccess?.(result);
        setLoadingMethod(null);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
      setLoadingMethod(null);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="modal-content" ref={modalRef}>
        <h2 id="auth-modal-title">Choose an authentication method</h2>

        <div className="auth-methods">
          <p className="muted">Select a wallet or identity provider to continue:</p>
          <div className="methods-grid">
            <button type="button" onClick={() => handleProvider('internet-identity')} className="auth-btn" disabled={!!loadingMethod}>
              {loadingMethod === 'internet-identity' ? 'Connecting…' : '🌐 Internet Identity'}
            </button>
            <button type="button" onClick={() => handleProvider('plug')} className="auth-btn" disabled={!!loadingMethod}>
              {loadingMethod === 'plug' ? 'Connecting…' : '🔌 Plug Wallet'}
            </button>
            <button type="button" onClick={() => handleProvider('stoic')} className="auth-btn" disabled={!!loadingMethod}>
              {loadingMethod === 'stoic' ? 'Connecting…' : '⚡ Stoic Wallet'}
            </button>
            <button type="button" onClick={() => handleProvider('nfid')} className="auth-btn" disabled={!!loadingMethod}>
              {loadingMethod === 'nfid' ? 'Connecting…' : '🆔 NFID'}
            </button>
          </div>
        </div>

        <hr />

        <form onSubmit={(e) => { e.preventDefault(); handleProvider('password'); }}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              aria-required="true"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={!!loadingMethod}>
              Cancel
            </button>
            <button type="submit" disabled={!!loadingMethod}>
              {loadingMethod === 'password' ? 'Signing in…' : 'Login'}
            </button>
          </div>
        </form>

        {error && <div className="error" role="alert">{error}</div>}
      </div>
    </div>
  );
}
