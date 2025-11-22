/*
  Verifier Service Canister (skeleton)
  - Provides on-chain hooks for attestations and issuance triggers.
  - In many deployments the verifier service is off-chain; this scaffold provides a simple interface
    for issuing compact attestations and emitting events.
*/

actor {
  // Lightweight scaffold: keep iat as text to avoid Nat conversions in the scaffold.
  public type Issued = { subject : Text; vcHash : Text; issuer : Text; iat : Text };

  // Issue a VC anchor: returns a placeholder vcHash (caller should compute securely off-chain)
  public shared(msg) func issueVC(subject : Text, vcPayload : Text) : async Text {
    let vcHash = "sha256:placeholder-" # subject;
    // NOTE: state persistence and indexing omitted in this scaffold; perform off-chain hashing and anchoring for production.
    vcHash
  };

  // Notify that an attestation has been recorded (hooks for off-chain services)
  public shared(msg) func notifyAttestation(subject : Text, note : Text) : async Bool {
    // TODO: queue verification tasks, signal indexers
    true
  };
};
