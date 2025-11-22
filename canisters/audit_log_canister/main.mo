/*
  Audit Log Canister (skeleton)
  - Stores chronological audit entries and exposes retrieval methods.
*/
import Time "mo:base/Time";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

persistent actor AuditLog {
  public type Entry = { ts : Nat; who : Text; note : Text };

  // Scaffold: not persisting entries yet. recordAudit acknowledges with 0.
  public shared(msg) func recordAudit(who : Text, note : Text) : async Nat {
    0
  };

  public query func getEntries() : async [Entry] {
    []
  };
};
