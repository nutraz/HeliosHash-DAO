import { useAppStore } from '@/lib/store';
import { Bell, Key, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';

const SecuritySettings = () => {
  const {
    twoFactorEnabled,
    notificationSettings,
    setTwoFactorEnabled,
    setNotificationSettings,
    addNotification
  } = useAppStore();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'New passwords do not match',
        timestamp: Date.now(),
        read: false,
      });
      return;
    }

    if (passwords.new.length < 8) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Password must be at least 8 characters long',
        timestamp: Date.now(),
        read: false,
      });
      return;
    }

    // In a real app, this would make an API call
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      message: 'Password changed successfully!',
      timestamp: Date.now(),
      read: false,
    });

    setPasswords({ current: '', new: '', confirm: '' });
    setShowChangePassword(false);
  };

  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });

    addNotification({
      id: Date.now().toString(),
      type: 'success',
      message: `${setting.charAt(0).toUpperCase() + setting.slice(1)} notifications ${!notificationSettings[setting] ? 'enabled' : 'disabled'}`,
      timestamp: Date.now(),
      read: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-3 text-blue-400" />
          Security Settings
        </h2>
        <p className="text-blue-300">Manage your account security and privacy preferences</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-blue-300 text-sm">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button
            onClick={() => {
              setTwoFactorEnabled(!twoFactorEnabled);
              addNotification({
                id: Date.now().toString(),
                type: 'success',
                message: `Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`,
                timestamp: Date.now(),
                read: false,
              });
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              twoFactorEnabled ? 'bg-green-500' : 'bg-gray-600'
            }`}
            aria-label={`Toggle two-factor authentication ${twoFactorEnabled ? 'off' : 'on'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-300 text-sm">
              ✅ Two-factor authentication is enabled. Your account is more secure.
            </p>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Key className="w-6 h-6 text-orange-400" />
            <div>
              <p className="text-white font-medium">Change Password</p>
              <p className="text-blue-300 text-sm">Update your account password</p>
            </div>
          </div>
          <button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            {showChangePassword ? 'Cancel' : 'Change'}
          </button>
        </div>

        {showChangePassword && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="w-full bg-slate-700/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="password"
              placeholder="New password"
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              className="w-full bg-slate-700/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              className="w-full bg-slate-700/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              onClick={handlePasswordChange}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="w-6 h-6 text-purple-400" />
          <div>
            <p className="text-white font-medium">Notification Preferences</p>
            <p className="text-blue-300 text-sm">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationChange(key as keyof typeof notificationSettings)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-blue-300 capitalize">{key} notifications</span>
              </div>
              <span className={`text-sm ${value ? 'text-green-400' : 'text-gray-500'}`}>
                {value ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Account Recovery */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-white font-medium mb-3">Account Recovery</h3>
        <div className="space-y-3">
          <button className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white rounded-lg py-3 px-4 border border-blue-500/20 transition text-left">
            Download recovery phrase
          </button>
          <button className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white rounded-lg py-3 px-4 border border-blue-500/20 transition text-left">
            Set up recovery email
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-red-400 font-medium mb-3">Danger Zone</h3>
        <p className="text-red-300 text-sm mb-4">
          These actions are irreversible. Please be certain before proceeding.
        </p>
        <div className="space-y-3">
          <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg py-3 px-4 border border-red-500/30 transition">
            Delete all transaction history
          </button>
          <button className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg py-3 px-4 border border-red-500/30 transition">
            Deactivate account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;