import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

/* Revocation canister — single persistent actor using HashMap with stable backing */
persistent actor RevocationCanister {
  // stable array of entries: vcHash -> (issuer, revokedAt, reason)
  var revokedEntries : [(Text, (Text, Int, Text))] = [];

  // transient HashMap rebuilt after upgrades
  private transient var revoked : HashMap.HashMap<Text, (Text, Int, Text)> =
    HashMap.HashMap(10, Text.equal, Text.hash);

  // Persist transient map into stable array before upgrade
  system func preupgrade() {
    revokedEntries := Iter.toArray(revoked.entries());
  };

  // Rebuild transient map from stable array after upgrade
  system func postupgrade() {
    revoked := HashMap.fromIter<Text, (Text, Int, Text)>(
      revokedEntries.vals(), 10, Text.equal, Text.hash
    );
    revokedEntries := [];
  };

  public shared(_msg) func revoke(vcHash : Text, issuer : Text, revokedAt : Int, reason : Text) : async Bool {
    revoked.put(vcHash, (issuer, revokedAt, reason));
    true
  };

  public query func getRevocation(vcHash : Text) : async ?(Text, Int, Text) {
    revoked.get(vcHash)
  };

  public query func isRevoked(vcHash : Text) : async Bool {
    switch (revoked.get(vcHash)) {
      case (null) false;
      case (?_) true;
    }
  };

  public query func listRevoked() : async [Text] {
    Iter.toArray(revoked.keys())
  };

  public query func status() : async Text {
    "revocation_canister: OK"
  };
};
