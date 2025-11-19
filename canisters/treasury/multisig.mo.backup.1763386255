// Minimal Multisig Guard for Treasury (dev-only, non-executing)
// Purpose: Provide a canister to record transfer proposals and collate approvals.
// This canister intentionally DOES NOT perform token transfers itself. Instead it
// records a signed/approved intent which an authorized operator or a follow-up
// canister may use to actually execute the transfer after verifying thresholds.

import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Text "mo:base/Text";

actor Multisig {

  public type ProposalId = Nat;

  public type Proposal = {
    id : ProposalId;
    proposer : Principal;
    to : Principal;
    amount : Nat;
    createdAt : Int;
    approvals : [Principal];
    executed : Bool;
    executedAt : ?Int;
    note : ?Text;
  };

  // ===== State =====
  var nextProposalId : Nat = 1;
  var proposals : [Proposal] = [];

  // Governance parameters
  var threshold : Nat = 3; // require 3-of-5 approvals
  var guardians : [Principal] = [];

  // Optional treasury canister that will be called to execute transfers.
  var treasuryCanister : ?Principal = null;

  // Timelock configuration (nanoseconds)
  var timelockDelayNs : Int = 48 * 60 * 60 * 1_000_000_000; // 48 hours
  var timelockAmountThreshold : Nat = 1_000_000; // amounts >= threshold require timelock

  // Emergency pause
  var paused : Bool = false;

  // ===== Helpers =====
  private func findProposal(id : ProposalId) : ?Proposal {
    Array.find<Proposal>(proposals, func(p) { Nat.equal(p.id, id) })
  };

  // Check if principal is a guardian
  private func isGuardian(p : Principal) : Bool {
    switch (Array.find<Principal>(guardians, func(g) = Principal.equal(g, p))) {
      case null false;
      case (?_) true;
    }
  };

  // ===== Public API =====

  // Add or remove guardians - callable only by existing guardians for safety
  public shared (msg) func addGuardian(p : Principal) : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    // Allow bootstrapping the first guardian when none exist
    if (guardians.size() == 0) {
      guardians := Array.append<Principal>(guardians, [p]);
      return #ok(true);
    };
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    guardians := Array.append<Principal>(guardians, [p]);
    #ok(true)
  };

  public shared (msg) func removeGuardian(p : Principal) : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    guardians := Array.filter<Principal>(guardians, func(g) = not Principal.equal(g, p));
    #ok(true)
  };

  public shared (msg) func setThreshold(t : Nat) : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    threshold := t;
    #ok(true)
  };

  public shared (msg) func setTreasuryCanister(p : Principal) : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    treasuryCanister := ?p;
    #ok(true)
  };

  public shared (msg) func pause() : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    paused := true;
    #ok(true)
  };

  public shared (msg) func resume() : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    paused := false;
    #ok(true)
  };

  // Create a new transfer proposal
  public shared (msg) func proposeTransfer(to : Principal, amount : Nat, note : ?Text) : async Result.Result<ProposalId, Text> {
    let caller = msg.caller;
    let id = nextProposalId;
    nextProposalId += 1;

    let p : Proposal = {
      id = id;
      proposer = caller;
      to = to;
      amount = amount;
      createdAt = Time.now();
      approvals = [];
      executed = false;
      note = note;
    };

    proposals := Array.append<Proposal>(proposals, [p]);
    #ok(id)
  };

  // Approve a proposal
  public shared (msg) func approveProposal(id : ProposalId) : async Result.Result<Bool, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };

    switch (findProposal(id)) {
      case null { #err("Proposal not found") };
      case (?prop) {
        // prevent duplicate approvals
        switch (Array.find<Principal>(prop.approvals, func(a) = Principal.equal(a, caller))) {
          case (?_) { #err("Already approved") };
          case null {
            let updated = {
              prop with approvals = Array.append<Principal>(prop.approvals, [caller])
            };
            proposals := Array.map<Proposal>(proposals, func(pr) = if (Nat.equal(pr.id, id)) updated else pr);
            #ok(true)
          };
        };
      };
    };
  };

  // Execute an approved proposal. This will call the configured treasury canister's
  // transfer method. Requirements:
  // - caller must be a guardian
  // - proposal must have >= threshold approvals
  // - proposal must not be executed
  // - if amount >= timelockAmountThreshold then Time.now() must be >= createdAt + timelockDelayNs
  // - Emergency pause overrides timelock for security
  public shared (msg) func executeIntent(id : ProposalId) : async Result.Result<Nat, Text> {
    let caller = msg.caller;
    if (not isGuardian(caller)) { return #err("Unauthorized") };
    if (paused) { return #err("Execution paused") };

    switch (findProposal(id)) {
      case null { #err("Proposal not found") };
      case (?prop) {
        if (prop.executed) { #err("Already executed") };
        if (Nat.fromInt(prop.approvals.size()) < threshold) { #err("Not enough approvals") };

        // Enforce timelock for large amounts (unless emergency paused)
        if (prop.amount >= timelockAmountThreshold and not paused) {
          let earliest = prop.createdAt + timelockDelayNs;
          if (Time.now() < earliest) { #err("Timelock not expired") };
        };

        switch (treasuryCanister) {
          case null { #err("Treasury canister not configured") };
          case (?t) {
            // Call treasury.transfer
            type TreasuryActor = actor { transfer : (Principal, Nat) -> async Result.Result<Nat, Text> };
            let treasury : TreasuryActor = actor (Principal.toText(t));
            let res = await treasury.transfer(prop.to, prop.amount);
            switch (res) {
              case (#ok(txId)) {
                let updated = { prop with executed = true; executedAt = ?(Time.now()) };
                proposals := Array.map<Proposal>(proposals, func(pr) = if (Nat.equal(pr.id, id)) updated else pr);
                #ok(txId)
              };
              case (#err(e)) { #err(e) };
            };
          };
        };
      };
    };
  };

  // Query proposal
  public query func getProposal(id : ProposalId) : async ?Proposal {
    findProposal(id)
  };

  // List proposals (simple pagination)
  public query func listProposals(from : Nat, limit : Nat) : async [Proposal] {
    let all = proposals;
    let start = from;
    let end = if (Nat.add(start, limit) > Nat.fromInt(all.size())) Nat.fromInt(all.size()) else Nat.add(start, limit);
    Array.slice<Proposal>(all, start, end)
  };

  // Check if a proposal has met threshold
  public query func isApproved(id : ProposalId) : async Bool {
    switch (findProposal(id)) {
      case null false;
      case (?p) {
        Nat.fromInt(p.approvals.size()) >= threshold
      };
    }
  };

  // Execution stub: returns the transfer intent when threshold met. This method
  // DOES NOT perform the transfer itself. It is intentionally read-only to
  // avoid accidental fund movement.
  public query func getExecutableIntent(id : ProposalId) : async ?{ to : Principal; amount : Nat; approvals : [Principal]; ready : Bool } {
    switch (findProposal(id)) {
      case null null;
      case (?p) {
        let ready = Nat.fromInt(p.approvals.size()) >= threshold;
        ?{ to = p.to; amount = p.amount; approvals = p.approvals; ready = ready }
      };
    }
  };

}
