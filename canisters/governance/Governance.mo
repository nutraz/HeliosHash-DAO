import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";

// C3: scoped member voting lifecycle. Member-gated proposals/votes, owner-managed
// governance-local membership, 1-member-1-vote with per-voter dedup, quorum +
// threshold + deadline (expiry). execute is FLAG-ONLY (Model 1): it fires once
// quorum + threshold are met while the proposal is still within its deadline;
// proposals past their deadline without passing are expired and cannot execute.
// No token movement, no cross-canister calls. State is stable (fixes H5).
persistent actor Governance {
  public type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposer : Principal;
    timestamp : Int;
    deadline : Int;
    votesFor : Nat;
    votesAgainst : Nat;
    voters : [Principal];
    executed : Bool;
  };

  // --- State (stable: survives upgrade) ---
  var nextProposalId : Nat = 1;
  var proposals : [Proposal] = [];
  var owner : ?Principal = null;
  var members : [Principal] = [];
  // Config (owner-gated setters). 1 member = 1 vote.
  var quorum : Nat = 1;                 // minimum total votes cast
  var thresholdPct : Nat = 50;          // required % of FOR votes out of total
  var votingPeriodNanos : Int = 7 * 24 * 60 * 60 * 1_000_000_000; // 7 days default

  // --- Helpers ---
  private func isMember(p : Principal) : Bool {
    for (m in members.vals()) { if (m == p) return true };
    false
  };

  private func isOwnerCaller(caller : Principal) : Bool {
    switch (owner) { case (null) { false }; case (?o) { caller == o } }
  };

  private func findProposalIndex(id : Nat) : ?Nat {
    var i : Nat = 0;
    let n = Array.size(proposals);
    while (i < n) { if (proposals[i].id == id) { return ?i }; i += 1 };
    null
  };

  private func hasVoted(p : Proposal, voter : Principal) : Bool {
    for (v in p.voters.vals()) { if (v == voter) return true };
    false
  };

  private func replaceProposal(idx : Nat, updated : Proposal) : [Proposal] {
    Array.tabulate<Proposal>(Array.size(proposals), func(j) { if (j == idx) updated else proposals[j] })
  };

  // --- Admin: ownership (controller-gated, same model as C1/C4/C5/C6) ---
  public shared ({ caller }) func setOwner(newOwner : Principal) : async Text {
    if (not Principal.isController(caller)) { return "Error: only a canister controller may set the owner" };
    if (Principal.isAnonymous(newOwner)) { return "Error: owner cannot be the anonymous principal" };
    owner := ?newOwner;
    return "Owner set";
  };

  // --- Admin: membership + config (owner-gated; owner controls admission) ---
  public shared ({ caller }) func addMember(m : Principal) : async Text {
    if (not isOwnerCaller(caller)) { return "Error: caller is not the governance owner" };
    if (Principal.isAnonymous(m)) { return "Error: cannot add the anonymous principal" };
    if (isMember(m)) { return "Already a member" };
    members := Array.append(members, [m]);
    return "Member added";
  };

  public shared ({ caller }) func removeMember(m : Principal) : async Text {
    if (not isOwnerCaller(caller)) { return "Error: caller is not the governance owner" };
    members := Array.filter<Principal>(members, func(x) { x != m });
    return "Member removed";
  };

  public shared ({ caller }) func setQuorum(n : Nat) : async Text {
    if (not isOwnerCaller(caller)) { return "Error: caller is not the governance owner" };
    quorum := n;
    return "Quorum set";
  };

  public shared ({ caller }) func setThreshold(pct : Nat) : async Text {
    if (not isOwnerCaller(caller)) { return "Error: caller is not the governance owner" };
    if (pct > 100) { return "Error: threshold must be 0..100" };
    thresholdPct := pct;
    return "Threshold set";
  };

  public shared ({ caller }) func setVotingPeriod(nanos : Int) : async Text {
    if (not isOwnerCaller(caller)) { return "Error: caller is not the governance owner" };
    if (nanos < 0) { return "Error: voting period must be >= 0" };
    votingPeriodNanos := nanos;
    return "Voting period set";
  };

  // --- Proposal lifecycle ---
  public shared ({ caller }) func createProposal(title : Text, description : Text) : async Text {
    if (Principal.isAnonymous(caller)) { return "Error: anonymous caller not permitted" };
    if (not isMember(caller)) { return "Error: caller is not a governance member" };
    let now = Time.now();
    let proposal : Proposal = {
      id = nextProposalId;
      title = title;
      description = description;
      proposer = caller;
      timestamp = now;
      deadline = now + votingPeriodNanos;
      votesFor = 0;
      votesAgainst = 0;
      voters = [];
      executed = false;
    };
    proposals := Array.append(proposals, [proposal]);
    nextProposalId += 1;
    return "Proposal created: " # Nat.toText(proposal.id);
  };

  public shared ({ caller }) func vote(proposalId : Nat, inFavor : Bool) : async Text {
    if (Principal.isAnonymous(caller)) { return "Error: anonymous caller not permitted" };
    if (not isMember(caller)) { return "Error: caller is not a governance member" };
    switch (findProposalIndex(proposalId)) {
      case (null) { return "Error: proposal not found" };
      case (?i) {
        let p = proposals[i];
        if (p.executed) { return "Error: proposal already executed" };
        if (Time.now() > p.deadline) { return "Error: proposal expired; voting closed" };
        if (hasVoted(p, caller)) { return "Error: caller has already voted" };
        let updated : Proposal = {
          id = p.id;
          title = p.title;
          description = p.description;
          proposer = p.proposer;
          timestamp = p.timestamp;
          deadline = p.deadline;
          votesFor = if (inFavor) { p.votesFor + 1 } else { p.votesFor };
          votesAgainst = if (inFavor) { p.votesAgainst } else { p.votesAgainst + 1 };
          voters = Array.append(p.voters, [caller]);
          executed = p.executed;
        };
        proposals := replaceProposal(i, updated);
        return "Vote recorded";
      };
    };
  };

  // Flag-only execute (Model 1): any member, once conditions pass and still within
  // the deadline. No token movement, no cross-canister calls.
  public shared ({ caller }) func execute(proposalId : Nat) : async Text {
    if (Principal.isAnonymous(caller)) { return "Error: anonymous caller not permitted" };
    if (not isMember(caller)) { return "Error: caller is not a governance member" };
    switch (findProposalIndex(proposalId)) {
      case (null) { return "Error: proposal not found" };
      case (?i) {
        let p = proposals[i];
        if (p.executed) { return "Error: proposal already executed" };
        if (Time.now() > p.deadline) { return "Error: proposal expired; cannot execute" };
        let totalVotes = p.votesFor + p.votesAgainst;
        if (totalVotes < quorum) { return "Error: quorum not met" };
        // threshold: votesFor must be >= thresholdPct% of total votes cast
        if (p.votesFor * 100 < thresholdPct * totalVotes) { return "Error: threshold not met" };
        let updated : Proposal = {
          id = p.id;
          title = p.title;
          description = p.description;
          proposer = p.proposer;
          timestamp = p.timestamp;
          deadline = p.deadline;
          votesFor = p.votesFor;
          votesAgainst = p.votesAgainst;
          voters = p.voters;
          executed = true;
        };
        proposals := replaceProposal(i, updated);
        return "Proposal executed";
      };
    };
  };

  // --- Queries ---
  public query func getProposals() : async [Proposal] { proposals };

  public query func getMembers() : async [Principal] { members };

  public query func getConfig() : async { quorum : Nat; thresholdPct : Nat; votingPeriodNanos : Int } {
    { quorum = quorum; thresholdPct = thresholdPct; votingPeriodNanos = votingPeriodNanos }
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Governance v2.0 (C3)";
  };
}
