import Array "mo:base/Array";
import Debug "mo:base/Debug";

// Minimal IdentityCanister scaffold.
// Stores VC hashes per subject in stable memory and keeps a simple revocation list.
// This is a lightweight development scaffold — replace with robust storage in production.

persistent actor IdentityCanister {

  // Each entry: (subject, [vcHash])
  stable var vcStore : [ (Text, [Text]) ] = [];

  // Each entry: (vcHash, revoked)
  stable var revocations : [ (Text, Bool) ] = [];

  // Append a VC for a subject
  public shared(_msg) func addVC(subject : Text, vcHash : Text) : async Bool {
    let n = Array.size(vcStore);
    var i : Nat = 0;
    while (i < n) {
      if (vcStore[i].0 == subject) {
        vcStore := Array.map(vcStore, func (entry) {
          if (entry.0 == subject) (entry.0, Array.append(entry.1, [vcHash])) else entry
        });
        return true;
      };
      i += 1;
    };
    vcStore := Array.append(vcStore, [ (subject, [vcHash]) ]);
    return true;
  };

  // Get VCs for a subject
  public query func getVCs(subject : Text) : async [Text] {
    let n = Array.size(vcStore);
    var i : Nat = 0;
    while (i < n) {
      if (vcStore[i].0 == subject) return vcStore[i].1;
      i += 1;
    };
    return [];
  };

  // Check existence of VC for a subject
  public query func hasVC(subject : Text, vcHash : Text) : async Bool {
    let n = Array.size(vcStore);
    var i : Nat = 0;
    while (i < n) {
      if (vcStore[i].0 == subject) {
        let arr = vcStore[i].1;
        var j : Nat = 0;
        let m = Array.size(arr);
        while (j < m) {
          if (arr[j] == vcHash) return true;
          j += 1;
        };
        return false;
      };
      i += 1;
    };
    return false;
  };

  // Revoke a VC (mark revoked)
  public shared(_msg) func revokeVC(vcHash : Text) : async Bool {
    let n = Array.size(revocations);
    var i : Nat = 0;
    while (i < n) {
      if (revocations[i].0 == vcHash) {
        revocations := Array.map(revocations, func (r) { if (r.0 == vcHash) (vcHash, true) else r });
        return true;
      };
      i += 1;
    };
    revocations := Array.append(revocations, [ (vcHash, true) ]);
    return true;
  };

  // Check revocation status
  public query func isRevoked(vcHash : Text) : async Bool {
    let n = Array.size(revocations);
    var i : Nat = 0;
    while (i < n) {
      if (revocations[i].0 == vcHash) return revocations[i].1;
      i += 1;
    };
    return false;
  };

  public query func status() : async Text { "identity_canister: OK" };
};
