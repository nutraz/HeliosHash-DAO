/*
  Revocation Canister (skeleton)
  - Manage simple revocation list for VC hashes
*/

persistent actor Revocation {
  // Stateless scaffold: real revocation storage should use stable structures (e.g. Merkle roots or arrays) and be carefully upgraded.
  public shared(msg) func addRevocation(vcHash : Text) : async Bool {
    // No-op scaffold: accept the call and return true.
    true
  };

  public query func isRevoked(vcHash : Text) : async Bool {
    // Always return false in scaffold.
    false
  };

  public query func listRevoked() : async [Text] {
    []
  };
};
