import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";

// Persistent verifier service - lightweight issuance anchor
persistent actor VerifierService {

  // issuance records: vcHash -> (issuer, subject, issuedAt)
  stable var issuance : HashMap.HashMap<Text, (Text, Text, Int)> = HashMap.HashMap<Text, (Text, Text, Int)>();

  public shared(msg) func recordIssuance(vcHash : Text, issuer : Text, subject : Text, issuedAt : Int) : async Bool {
    issuance.put(vcHash, (issuer, subject, issuedAt));
    true
  };

  public query func getIssuance(vcHash : Text) : async Opt<(Text, Text, Int)> {
    issuance.get(vcHash)
  };

  public shared(msg) func recordIssuanceWithProject(vcHash : Text, issuer : Text, subject : Text, issuedAt : Int, projectId : Text, level : Int) : async Bool {
    issuance.put(vcHash, (issuer # ("|" # projectId), subject, issuedAt));
    true
  };

  public query func status() : async Text {
    "verifier_service: OK"
  };
};
