import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Iter "mo:base/Iter";

persistent actor VerifierService {

  // Stable storage for issuance records
  stable var issuanceEntries : [(Text, (Text, Text, Int))] = [];

  // Non-stable HashMap (rebuilt after upgrade)
  private transient var issuance : HashMap.HashMap<Text, (Text, Text, Int)> =
    HashMap.HashMap(10, Text.equal, Text.hash);

  // Before upgrade: convert HashMap → stable array
  system func preupgrade() {
    issuanceEntries := Iter.toArray(issuance.entries());
  };

  // After upgrade: rebuild HashMap from stable array
  system func postupgrade() {
    issuance := HashMap.fromIter<Text, (Text, Text, Int)>(
      issuanceEntries.vals(),
      10,
      Text.equal,
      Text.hash,
    );
    issuanceEntries := []; // free space
  };

  // Record an issuance
  public shared(_msg) func recordIssuance(
    issuance_id : Text,
    project_id : Text,
    verifier_id : Text,
    amount : Int
  ) : async () {
    issuance.put(issuance_id, (project_id, verifier_id, amount));
  };

  // Read issuance
  public query func getIssuance(issuance_id : Text) : async ?(Text, Text, Int) {
    return issuance.get(issuance_id);
  };

  // Dump all entries
  public query func getAllIssuances() : async [(Text, (Text, Text, Int))] {
    return Iter.toArray(issuance.entries());
  };
}
