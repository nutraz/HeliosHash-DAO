import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

// Persistent actor keeps stable memory across upgrades
persistent actor AuditLog {

  // Each log entry: (id, hash)
  stable var logs : [ (Nat, Text) ] = [];
  stable var counter : Nat = 0;

  // Audit-write authority (H6). Set post-deploy by a canister controller via
  // setOwner; same model as C1/C4/C5/C6.
  stable var owner : ?Principal = null;

  private func isOwner(caller : Principal) : Bool {
    if (Principal.isAnonymous(caller)) { return false };
    switch (owner) {
      case (null) { false };
      case (?o) { caller == o };
    };
  };

  public shared ({ caller }) func setOwner(newOwner : Principal) : async Bool {
    if (not Principal.isController(caller)) { return false };
    if (Principal.isAnonymous(newOwner)) { return false };
    owner := ?newOwner;
    return true;
  };

  // Append a new log entry, return its ID. Owner-gated (H6); traps on unauthorized.
  public shared ({ caller }) func append(logHash : Text) : async Nat {
    if (not isOwner(caller)) { Debug.trap("unauthorized") };
    counter += 1;
    logs := Array.append(logs, [ (counter, logHash) ]);
    return counter;
  };

  // Retrieve a log entry by ID (empty string = not found)
  public query func getLog(id : Nat) : async Text {
    let n = Array.size(logs);
    var i : Nat = 0;

    while (i < n) {
      if (logs[i].0 == id) return logs[i].1;
      i += 1;
    };

    return "";
  };

  // Return last `limit` entries, or all entries if limit = 0
  public query func tail(limit : Nat) : async [ (Nat, Text) ] {
    if (limit == 0) return logs;

    let n = Array.size(logs);
    let start = if (n <= limit) 0 else (n - limit);

    var out : [ (Nat, Text) ] = [];
    var i : Nat = start;

    while (i < n) {
      out := Array.append(out, [ logs[i] ]);
      i += 1;
    };

    return out;
  };

  // Simple health check
  public query func status() : async Text { "audit_log_canister: OK" };
};
