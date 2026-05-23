import Prim "mo:prim";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Array "mo:base/Array";

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

  // H1b: typed, seedable project stats — the read model for
  // /projects/helios-baghpat. `btc_mined_sats` is satoshis (exact integer; the
  // frontend converts to BTC for display). `last_updated` is ms-epoch, stamped
  // server-side on each seed (any client value is ignored).
  type ProjectStats = {
    panels : Nat;
    energy_year_mwh : Nat;
    solar_today_kwh : Nat;
    btc_mined_sats : Nat;
    turmeric_growth_pct : Nat;
    members : Nat;
    last_updated : Nat;
    source : Text;
  };

  // Stable, upgrade-safe store of per-project stats (assoc array keyed by projectId).
  stable var statsEntries : [(Text, ProjectStats)] = [];

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

  private func lookupStats(projectId : Text) : ?ProjectStats {
    for ((k, v) in statsEntries.vals()) {
      if (k == projectId) { return ?v };
    };
    null
  };

  // --- H1b: typed Baghpat stats read model ---

  // Owner-gated seed/populate. `last_updated` is stamped server-side (ms epoch),
  // ignoring any client-supplied value, so reads carry an authoritative timestamp.
  public shared(msg) func set_project_stats(projectId : Text, s : ProjectStats) : async Result.Result<(), Text> {
    if (not isOwner(msg.caller)) { return #err("unauthorized") };
    let now : Nat = Int.abs(Time.now()) / 1_000_000;
    let stamped : ProjectStats = {
      panels = s.panels;
      energy_year_mwh = s.energy_year_mwh;
      solar_today_kwh = s.solar_today_kwh;
      btc_mined_sats = s.btc_mined_sats;
      turmeric_growth_pct = s.turmeric_growth_pct;
      members = s.members;
      last_updated = now;
      source = s.source;
    };
    let filtered = Array.filter<(Text, ProjectStats)>(statsEntries, func(e) { e.0 != projectId });
    statsEntries := Array.append<(Text, ProjectStats)>(filtered, [(projectId, stamped)]);
    #ok(())
  };

  // Public read — now a query returning the typed record (cheap, no per-call
  // cycle burn). #err("not found") when a project has not been seeded.
  public query func get_project_stats(projectId : Text) : async Result.Result<ProjectStats, Text> {
    switch (lookupStats(projectId)) {
      case (?s) { #ok(s) };
      case (null) { #err("not found") };
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

  // --- Reads: public, candid-unchanged. ---

  public func list_opportunities(project_id: Text, filter: ?Text): async Result.Result<[Text], Text> {
    #ok([])
  };
};
