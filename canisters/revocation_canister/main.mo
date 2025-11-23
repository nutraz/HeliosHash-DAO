import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";

actor RevocationCanister {

  // store revocation entries: vcHash -> (issuer, revokedAt, reason)
  stable var revoked : HashMap.HashMap<Text, (Text, Int, Text)> = HashMap.HashMap<Text, (Text, Int, Text)>();

  public shared(msg) func revoke(vcHash : Text, issuer : Text, revokedAt : Int, reason : Text) : async Bool {
    revoked.put(vcHash, (issuer, revokedAt, reason));
    true
  };

  public query func isRevoked(vcHash : Text) : async Opt<(Text, Int, Text)> {
    revoked.get(vcHash)
  };

  public query func status() : async Text { "revocation_canister: OK" };
};
import Array "mo:base/Array";
import Int "mo:base/Int";

/* Revocation canister scaffold: single persistent actor */
persistent actor RevocationCanister {
  // store revocation entries: vcHash -> (issuer, revokedAt, reason)
  stable var revoked : [ (Text, (Text, Int, Text)) ] = [];

  public shared(msg) func revoke(vcHash : Text, issuer : Text, revokedAt : Int, reason : Text) : async Bool {
    let n = Array.size(revoked);
    var i : Nat = 0;
    while (i < n) {
      if (revoked[i].0 == vcHash) {
        // replace existing entry
        revoked := Array.map(revoked, func (e) {
          if (e.0 == vcHash) (vcHash, (issuer, revokedAt, reason)) else e
        });
        return true;
      };
      i += 1;
    };
    // append new revocation
    revoked := Array.append(revoked, [ (vcHash, (issuer, revokedAt, reason)) ]);
    return true;
  };

  public query func isRevoked(vcHash : Text) : async Bool {
    let n = Array.size(revoked);
    var i : Nat = 0;
    while (i < n) {
      if (revoked[i].0 == vcHash) return true;
      i += 1;
    };
    return false;
  };

  public query func listRevoked() : async [Text] {
    let n = Array.size(revoked);
    var out : [Text] = [];
    var i : Nat = 0;
    while (i < n) {
      out := Array.append(out, [revoked[i].0]);
      i += 1;
    };
    return out;
  };

  public query func status() : async Text { "revocation_canister: OK" };
};
