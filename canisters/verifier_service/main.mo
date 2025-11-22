import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Int "mo:base/Int";

persistent actor VerifierService {
  // issuance records: vcHash -> (issuer, subject, issuedAt)
  stable var issuance : [(Text, (Text, Text, Int))] = [];

  func findIndexLocal(vcHash : Text) : Nat {
    let n = Array.size(issuance);
    var i : Nat = 0;
    while (i < n) {
      if (issuance[i].0 == vcHash) return i;
      i += 1;
    };
    return n; // sentinel: not found
  };

  public shared(msg) func recordIssuance(vcHash : Text, issuer : Text, subject : Text, issuedAt : Int) : async Bool {
    let idx = findIndexLocal(vcHash);
    if (idx < Array.size(issuance)) {
      issuance := Array.map(issuance, func (e) { if (e.0 == vcHash) (vcHash, (issuer, subject, issuedAt)) else e });
    } else {
      issuance := Array.append(issuance, [(vcHash, (issuer, subject, issuedAt))]);
    };
    return true;
  };

  public query func getIssuance(vcHash : Text) : async Text {
    let idx = findIndexLocal(vcHash);
    if (idx < Array.size(issuance)) {
      let t = issuance[idx].1;
      return t.0 # "|" # t.1 # "|" # Int.toText(t.2);
    } else { return "NOT_FOUND" }
  };

  public shared(msg) func recordIssuanceWithProject(vcHash : Text, issuer : Text, subject : Text, issuedAt : Int, projectId : Text, level : Int) : async Bool {
    let issuerExtended = issuer # ("|" # projectId);
    let idx = findIndexLocal(vcHash);
    if (idx < Array.size(issuance)) {
      issuance := Array.map(issuance, func (e) { if (e.0 == vcHash) (vcHash, (issuerExtended, subject, issuedAt)) else e });
    } else {
      issuance := Array.append(issuance, [(vcHash, (issuerExtended, subject, issuedAt))]);
    };
    return true;
  };

  public query func status() : async Text { "verifier_service: OK" };
};
