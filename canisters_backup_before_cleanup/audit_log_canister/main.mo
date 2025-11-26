import Array "mo:base/Array";
import Debug "mo:base/Debug";

// Persistent actor keeps stable memory across upgrades
persistent actor AuditLog {

  // Each log entry: (id, hash)
  stable var logs : [ (Nat, Text) ] = [];
  stable var counter : Nat = 0;

  // Append a new log entry, return its ID
  public shared(_msg) func append(logHash : Text) : async Nat {
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
