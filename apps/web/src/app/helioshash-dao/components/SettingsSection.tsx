export default function SettingsSection() {
  return (
    <section className="settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Settings</h2>
      <div className="settings-options">
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Email Notifications
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            SMS Alerts
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            Governance Updates
          </label>
        </div>
      </div>
    </section>
  );
}
