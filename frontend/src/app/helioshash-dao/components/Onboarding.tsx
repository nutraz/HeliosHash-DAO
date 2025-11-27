export default function Onboarding() {
  return (
    <section className="onboarding" aria-labelledby="onboarding-title">
      <h2 id="onboarding-title">Member Onboarding</h2>
      <div className="onboarding-steps">
        <div className="step">
          <h3>Step 1: Identity Verification</h3>
          <p>Verify your identity using Aadhaar or similar methods</p>
        </div>
        <div className="step">
          <h3>Step 2: Community Registration</h3>
          <p>Register with your local community group</p>
        </div>
        <div className="step">
          <h3>Step 3: Governance Access</h3>
          <p>Gain voting rights and participation access</p>
        </div>
      </div>
    </section>
  );
}
