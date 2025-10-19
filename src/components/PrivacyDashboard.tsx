import React, { useEffect, useState } from 'react';
import { ConsentLevel, GenderOption, privacyService, PrivacySettings } from '../services/privacyComplianceService';

interface PrivacyDashboardProps {
  userId: string;
  onClose?: () => void;
}

interface DashboardData {
  hasConsent: boolean;
  consentLevel: ConsentLevel;
  genderStored: boolean;
  settings: PrivacySettings | null;
  dataRetentionDays: number;
  canWithdraw: boolean;
  lastAccessed?: number;
  accessCount?: number;
}

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({ userId, onClose }) => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [showGenderForm, setShowGenderForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await privacyService.getPrivacyDashboard(userId);
      setDashboard(data);
    } catch (err) {
      setError('Failed to load privacy dashboard');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleObtainConsent = async (consentLevel: ConsentLevel, settings: Partial<PrivacySettings>) => {
    try {
      const result = await privacyService.obtainConsent(userId, consentLevel, settings);
      if (result.success) {
        await loadDashboard();
        setShowConsentForm(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to obtain consent');
    }
  };

  const handleStoreGender = async (gender: GenderOption) => {
    try {
      const result = await privacyService.storeGenderData(userId, gender);
      if (result.success) {
        await loadDashboard();
        setShowGenderForm(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to store gender data');
    }
  };

  const handleWithdrawConsent = async (reason: string) => {
    try {
      const result = await privacyService.withdrawConsentAndDeleteData(userId, reason);
      if (result.success) {
        await loadDashboard();
        setShowWithdrawForm(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to withdraw consent');
    }
  };

  if (loading) {
    return (
      <div className="privacy-dashboard">
        <div className="loading">Loading privacy dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="privacy-dashboard">
        <div className="error">{error}</div>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="privacy-dashboard">
        <div className="error">No dashboard data available</div>
      </div>
    );
  }

  return (
    <div className="privacy-dashboard">
      <div className="dashboard-header">
        <h2>Privacy Dashboard</h2>
        {onClose && <button onClick={onClose} className="close-btn">×</button>}
      </div>

      <div className="dashboard-content">
        {/* Consent Status */}
        <div className="section">
          <h3>Consent Status</h3>
          <div className="status-item">
            <span>Consent Level:</span>
            <span className={`level-${dashboard.consentLevel}`}>
              {dashboard.consentLevel.toUpperCase()}
            </span>
          </div>
          <div className="status-item">
            <span>Has Consent:</span>
            <span className={dashboard.hasConsent ? 'yes' : 'no'}>
              {dashboard.hasConsent ? 'Yes' : 'No'}
            </span>
          </div>
          {!dashboard.hasConsent && (
            <button onClick={() => setShowConsentForm(true)} className="action-btn">
              Obtain Consent
            </button>
          )}
        </div>

        {/* Gender Data */}
        <div className="section">
          <h3>Gender Information</h3>
          <div className="status-item">
            <span>Data Stored:</span>
            <span className={dashboard.genderStored ? 'yes' : 'no'}>
              {dashboard.genderStored ? 'Yes' : 'No'}
            </span>
          </div>
          {dashboard.lastAccessed && (
            <div className="status-item">
              <span>Last Accessed:</span>
              <span>{new Date(dashboard.lastAccessed).toLocaleDateString()}</span>
            </div>
          )}
          {dashboard.accessCount !== undefined && (
            <div className="status-item">
              <span>Access Count:</span>
              <span>{dashboard.accessCount}</span>
            </div>
          )}
          {dashboard.hasConsent && !dashboard.genderStored && (
            <button onClick={() => setShowGenderForm(true)} className="action-btn">
              Provide Gender Information
            </button>
          )}
        </div>

        {/* Privacy Settings */}
        {dashboard.settings && (
          <div className="section">
            <h3>Privacy Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <span>Data Collection:</span>
                <span>{dashboard.settings.allowDataCollection ? 'Allowed' : 'Disabled'}</span>
              </div>
              <div className="setting-item">
                <span>Bonus Eligibility:</span>
                <span>{dashboard.settings.allowBonusEligibility ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="setting-item">
                <span>Analytics:</span>
                <span>{dashboard.settings.allowAnalytics ? 'Allowed' : 'Disabled'}</span>
              </div>
              <div className="setting-item">
                <span>Data Retention:</span>
                <span>{dashboard.settings.dataRetentionPeriod} days</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="section">
          <h3>Actions</h3>
          {dashboard.canWithdraw && (
            <button onClick={() => setShowWithdrawForm(true)} className="withdraw-btn">
              Withdraw Consent & Delete Data
            </button>
          )}
          <button onClick={loadDashboard} className="refresh-btn">
            Refresh Dashboard
          </button>
        </div>
      </div>

      {/* Consent Form Modal */}
      {showConsentForm && (
        <ConsentForm
          onSubmit={handleObtainConsent}
          onCancel={() => setShowConsentForm(false)}
        />
      )}

      {/* Gender Form Modal */}
      {showGenderForm && (
        <GenderForm
          onSubmit={handleStoreGender}
          onCancel={() => setShowGenderForm(false)}
        />
      )}

      {/* Withdraw Form Modal */}
      {showWithdrawForm && (
        <WithdrawForm
          onSubmit={handleWithdrawConsent}
          onCancel={() => setShowWithdrawForm(false)}
        />
      )}
    </div>
  );
};

// Consent Form Component
const ConsentForm: React.FC<{
  onSubmit: (level: ConsentLevel, settings: Partial<PrivacySettings>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [consentLevel, setConsentLevel] = useState<ConsentLevel>('basic');
  const [settings, setSettings] = useState<Partial<PrivacySettings>>({
    allowDataCollection: true,
    allowBonusEligibility: false,
    allowAnalytics: false,
    allowThirdPartySharing: false,
    dataRetentionPeriod: 2555,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(consentLevel, settings);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Obtain Consent</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="consent-level">Consent Level:</label>
            <select
              id="consent-level"
              value={consentLevel}
              onChange={(e) => setConsentLevel(e.target.value as ConsentLevel)}
            >
              <option value="none">None - No data collection</option>
              <option value="basic">Basic - Essential data only</option>
              <option value="full">Full - All features including women's empowerment bonus</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.allowDataCollection || false}
                onChange={(e) => setSettings({...settings, allowDataCollection: e.target.checked})}
              />
              Allow data collection for platform features
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.allowBonusEligibility || false}
                onChange={(e) => setSettings({...settings, allowBonusEligibility: e.target.checked})}
              />
              Allow bonus eligibility calculation (women's empowerment program)
            </label>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={settings.allowAnalytics || false}
                onChange={(e) => setSettings({...settings, allowAnalytics: e.target.checked})}
              />
              Allow anonymous analytics for platform improvement
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="primary">Submit Consent</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Gender Form Component
const GenderForm: React.FC<{
  onSubmit: (gender: GenderOption) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [gender, setGender] = useState<GenderOption>('not-provided');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(gender);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Provide Gender Information</h3>
        <p>This information is used solely for women's empowerment program eligibility and receives enhanced privacy protection.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gender-select">Gender:</label>
            <select id="gender-select" value={gender} onChange={(e) => setGender(e.target.value as GenderOption)}>
              <option value="not-provided">Prefer not to provide</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="privacy-notice">
            <p><strong>Privacy Notice:</strong></p>
            <ul>
              <li>Gender data is encrypted using AES-256 encryption</li>
              <li>Data is never shared with third parties</li>
              <li>You can delete this information at any time</li>
              <li>Female participants receive 20% bonus tokens</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Withdraw Form Component
const WithdrawForm: React.FC<{
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Withdraw Consent & Delete Data</h3>
        <p className="warning">
          This action will permanently delete all your gender data and cannot be undone.
          You can re-consent and provide information again at any time.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="withdraw-reason">Reason for withdrawal (optional):</label>
            <textarea
              id="withdraw-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for withdrawing consent..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit" className="danger">Withdraw & Delete Data</button>
          </div>
        </form>
      </div>
    </div>
  );
};
