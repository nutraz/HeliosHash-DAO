import Prim "mo:prim";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

persistent actor class ProjectHub() = this {

  stable var _state = 0; // Persistent state variable
  // H1: owner for controller-gated writes. Set post-deploy via setOwner.
  stable var owner : ?Principal = null;

  type Project = {
    id: Text;
    name: Text;
    location: Text;
    capacity: Nat;
    metadata: ?Text;
  };

  // Controller-gated owner assignment (IC-native controller authority; the
  // deploy identity is a controller and can rotate the owner). Returns false
  // for non-controllers rather than trapping.
  public shared(msg) func setOwner(p : Principal) : async Bool {
    if (not Principal.isController(msg.caller)) { return false };
    owner := ?p;
    true
  };

  // Reject anonymous, null-owner, and non-owner callers.
  private func isOwner(caller : Principal) : Bool {
    if (Principal.isAnonymous(caller)) { return false };
    switch (owner) {
      case (null) { false };
      case (?o) { Principal.equal(caller, o) };
    }
  };

  // --- Writes: owner-gated. H1 is auth-only — these persist nothing yet, so an
  // authorized owner gets an honest "not implemented" instead of fake success;
  // anonymous/non-owner callers are rejected with "unauthorized". ---

  public shared(msg) func create_project(name: Text, location: Text, capacity: Nat, metadata: Text): async Result.Result<Project, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  public shared(msg) func update_status(project_id: Text, new_status: Text): async Result.Result<Project, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  public shared(msg) func post_update(project_id: Text, content: Text, author_id: Text): async Result.Result<Bool, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  public shared(msg) func create_opportunity(project_id: Text, job_type: Text, details: Text): async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  public shared(msg) func submit_dispute(project_id: Text, issue: Text, parties: [Text]): async Result.Result<Text, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  public shared(msg) func log_energy_production(project_id: Text, kwh: Nat, timestamp: Nat64): async Result.Result<Bool, Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    #err("not implemented")
  };

  // --- Reads: public, candid-unchanged (canned demo values; the frontend's
  // useHeliosLiveStats falls back to mock regardless). ---

  public func get_project_stats(project_id: Text): async Result.Result<Text, Text> {
    #ok("stats")
  };

  public func list_opportunities(project_id: Text, filter: ?Text): async Result.Result<[Text], Text> {
    #ok([])
  };
};
