import Debug "mo:base/Debug";
import Array "mo:base/Array";

actor AuditLog {

  stable var logs : [ (Int, Text) ] = [];
  stable var counter : Int = 0;

  public shared(msg) func append(logHash : Text) : async Int {
    counter += 1;
    logs := Array.append(logs, [ (counter, logHash) ]);
    counter
  };

  public query func getLog(id : Int) : async Opt<Text> {
    let idx = Array.findIndex<(Int, Text)>(func (x) { x.0 == id }, logs);
    switch (idx) {
      case (null) { null };
      case (?i) { ?(logs[i].1) };
    }
  };

  public query func tail(limit : Int) : async [ (Int, Text) ] {
    if (limit <= 0) {
      logs
    } else {
      let n = Array.length(logs);
      let start = if (n <= limit) 0 else (n - limit);
      Array.slice(logs, start, n)
    }
  };

  public query func status() : async Text { "audit_log_canister: OK" };
};
import Array "mo:base/Array";
/* Minimal AuditLog scaffold */
persistent actor AuditLog {
  stable var logs : [ (Nat, Text) ] = [];
  stable var counter : Nat = 0;

  public shared(msg) func append(logHash : Text) : async Nat {
    counter += 1;
    logs := Array.append(logs, [ (counter, logHash) ]);
    return counter;
  };

  public query func getLog(id : Nat) : async Text {
    let n = Array.size(logs);
    var i : Nat = 0;
    while (i < n) {
      if (logs[i].0 == id) return logs[i].1;
      i += 1;
    };
    return "";
  };

  public query func tail(limit : Nat) : async [ (Nat, Text) ] {
    if (limit == 0) { return logs } else {
      let n = Array.size(logs);
      let start = if (n <= limit) 0 else (n - limit);
      var out : [ (Nat, Text) ] = [];
      var i : Nat = start;
      while (i < n) {
        out := Array.append(out, [ logs[i] ]);
        i += 1;
      };
      return out;
    }
  };

  public query func status() : async Text { "audit_log_canister: OK" };
};
