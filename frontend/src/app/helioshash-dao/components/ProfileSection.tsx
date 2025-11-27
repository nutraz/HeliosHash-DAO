export default function ProfileSection() {
  return (
    <section className="profile" aria-labelledby="profile-title">
      <h2 id="profile-title">Your Profile</h2>
      <div className="profile-info">
        <div className="info-item">
          <strong>Member ID:</strong> 
          <span>MEM-001234</span>
        </div>
        <div className="info-item">
          <strong>Community:</strong> 
          <span>Urgam Valley</span>
        </div>
        <div className="info-item">
          <strong>Voting Power:</strong> 
          <span>15 tokens</span>
        </div>
      </div>
    </section>
  );
}
