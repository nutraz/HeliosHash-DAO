import Debug "mo:base/Debug";
import Array "mo:base/Array";

/*
  Minimal IdentityCanister scaffold.
  - Stores VC hashes per subject in stable memory (simple array map)
  - Keeps a simple revocation list
  Notes: This is explicitly a development scaffold; replace with more robust storage/indexing in production.
*/

persistent actor IdentityCanister {
  stable var vcStore : [(Text, [Text])] = [];
  stable var revocations : [(Text, Bool)] = [];

  public shared(msg) func addVC(subject : Text, vcHash : Text) : async Bool {
    let n = Array.size(vcStore);
    var found = false;
    var i : Nat = 0;
    while (i < n) {
      if (vcStore[i].0 == subject) { found := true; i := n };
      i += 1;
    };
    if (found) {
      vcStore := Array.map(vcStore, func (entry) {
        if (entry.0 == subject) (entry.0, Array.append(entry.1, [vcHash])) else entry
      });
      return true;
    };
    vcStore := Array.append(vcStore, [(subject, [vcHash])]);
    return true;
  };

  public query func getVCs(subject : Text) : async [Text] {
    let n = Array.size(vcStore);
    var i : Nat = 0;
    while (i < n) {
      if (vcStore[i].0 == subject) return vcStore[i].1;
      i += 1;
    };
    return [];
  };

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

  public shared(msg) func revokeVC(vcHash : Text) : async Bool {
    let n = Array.size(revocations);
    var found = false;
    var i : Nat = 0;
    while (i < n) {
      if (revocations[i].0 == vcHash) { found := true; i := n };
      i += 1;
    };
    if (found) {
      revocations := Array.map(revocations, func (r) { if (r.0 == vcHash) (vcHash, true) else r });
      return true;
    };
    revocations := Array.append(revocations, [(vcHash, true)]);
    return true;
  };

  public query func isRevoked(vcHash : Text) : async Bool {
    let n = Array.size(revocations);
    var i : Nat = 0;
    while (i < n) {
      if (revocations[i].0 == vcHash) return revocations[i].1;
      i += 1;
    };
    return false;
  };

  public query func status() : async Text {
    return "identity_canister: OK";
  };
};
