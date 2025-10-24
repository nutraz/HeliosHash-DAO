import Prim "mo:prim";
import Voting "voting";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

persistent actor Governance {
  // Enhanced Proposal structure with vote thresholds
  type Proposal = {
    id: Nat;
    title: Text;
    description: Text;
    votes: Nat;
    votingMethod: Voting.VotingMethod;
    createdAt: Int;
    executed: Bool;
    executedAt: ?Int;
    voteThreshold: Nat; // Minimum votes required for execution
    emergency: Bool; // Emergency proposals bypass some thresholds
  };

  // Governance configuration
  private transient var voteThresholdPercentage : Nat = 51; // 51% of total voting power
  private transient var emergencyThresholdPercentage : Nat = 75; // 75% for emergency actions
  private transient var totalVotingPower : Nat = 1000000; // Total OWP tokens eligible for voting
  private transient var paused : Bool = false; // Emergency pause for governance
  private transient var maxVotingPowerPercentage : Nat = 5; // Maximum 5% voting power per holder to prevent whale dominance

  var proposals: [Proposal] = [];

  public func createProposal(title: Text, description: Text): async Nat {
    let id = proposals.size();
    let threshold = (totalVotingPower * voteThresholdPercentage) / 100;
    let proposal = {
      id;
      title;
      description;
      votes = 0;
      votingMethod = #Quadratic;
      createdAt = Time.now();
      executed = false;
      executedAt = null;
      voteThreshold = threshold;
      emergency = false;
    };
    proposals := Array.append(proposals, [proposal]);
    id
  };

  public func createEmergencyProposal(title: Text, description: Text): async Nat {
    let id = proposals.size();
    let threshold = (totalVotingPower * emergencyThresholdPercentage) / 100;
    let proposal = {
      id;
      title;
      description;
      votes = 0;
      votingMethod = #Quadratic;
      createdAt = Time.now();
      executed = false;
      executedAt = null;
      voteThreshold = threshold;
      emergency = true;
    };
    proposals := Array.append(proposals, [proposal]);
    id
  };

  // Emergency pause/unpause governance
  public func pauseGovernance(): async Result.Result<(), Text> {
    if (paused) { return #err("Already paused") };
    paused := true;
    #ok(())
  };

  public func resumeGovernance(): async Result.Result<(), Text> {
    if (not paused) { return #err("Not paused") };
    paused := false;
    #ok(())
  };

  // Emergency functions to trigger treasury pause/resume through governance vote
  public func emergencyPauseTreasury(treasuryCanisterId: Principal): async () {
    if (paused) { return () };
    // This would require a governance proposal to be executed first
    // For now, simplified - in production, this should check for executed emergency proposal
    type TreasuryActor = actor {
      pauseTreasury : () -> async ()
    };
    let treasury : TreasuryActor = actor (Principal.toText(treasuryCanisterId));
    await treasury.pauseTreasury()
  };

  public func emergencyResumeTreasury(treasuryCanisterId: Principal): async () {
    if (paused) { return () };
    // This would require a governance proposal to be executed first
    type TreasuryActor = actor {
      resumeTreasury : () -> async ()
    };
    let treasury : TreasuryActor = actor (Principal.toText(treasuryCanisterId));
    await treasury.resumeTreasury()
  };

  public query func getProposals(): async [Proposal] {
    proposals
  };

  public func voteQuadratic(proposalId: Nat, tokens: Nat) : async Result.Result<Nat, Text> {
    if (paused) { return #err("Governance paused") };

    // Check voting power cap to prevent whale dominance
    let maxAllowedTokens = (totalVotingPower * maxVotingPowerPercentage) / 100;
    if (tokens > maxAllowedTokens) {
      return #err("Voting power exceeds maximum allowed limit of " # Nat.toText(maxVotingPowerPercentage) # "%");
    };

    // Find proposal
    let proposalOpt = Array.find(proposals, func(p) = p.id == proposalId);
    switch (proposalOpt) {
      case null { #err("Proposal not found") };
      case (?prop) {
        if (prop.executed) { return #err("Proposal already executed") };
        let votePower = Voting.quadraticVotes(tokens);
        let newVotes = prop.votes + votePower;
        let updated = { prop with votes = newVotes };
        proposals := Array.map(proposals, func(p) = if (p.id == proposalId) updated else p);
        #ok(votePower)
      };
    };
  };

  public func executeProposal(proposalId: Nat) : async Result.Result<(), Text> {
    if (paused) { return #err("Governance paused") };
    let proposalOpt = Array.find(proposals, func(p) = p.id == proposalId);
    switch (proposalOpt) {
      case null { #err("Proposal not found") };
      case (?prop) {
        if (prop.executed) { return #err("Already executed") };
        if (prop.votes < prop.voteThreshold) { return #err("Insufficient votes") };
        let updated = { prop with executed = true; executedAt = ?Time.now() };
        proposals := Array.map(proposals, func(p) = if (p.id == proposalId) updated else p);
        #ok(())
      };
    };
  };

  public func voteConviction(proposalId: Nat, tokens: Nat, timeHeld: Int) : async Result.Result<Nat, Text> {
    if (paused) { return #err("Governance paused") };

    // Check voting power cap to prevent whale dominance
    let maxAllowedTokens = (totalVotingPower * maxVotingPowerPercentage) / 100;
    if (tokens > maxAllowedTokens) {
      return #err("Voting power exceeds maximum allowed limit of " # Nat.toText(maxVotingPowerPercentage) # "%");
    };

    let proposalOpt = Array.find(proposals, func(p) = p.id == proposalId);
    switch (proposalOpt) {
      case null { #err("Proposal not found") };
      case (?prop) {
        if (prop.executed) { return #err("Proposal already executed") };
        let votePower = Voting.convictionVotes(tokens, timeHeld);
        let newVotes = prop.votes + votePower;
        let updated = { prop with votes = newVotes };
        proposals := Array.map(proposals, func(p) = if (p.id == proposalId) updated else p);
        #ok(votePower)
      };
    };
  };

  public func delegateVote(delegator: Principal, delegatee: Principal) : async Result.Result<Bool, Text> {
    // Delegation logic - simplified for now
    #ok(true)
  };

  // Query functions
  public query func getGovernanceStatus() : async { paused: Bool; totalVotingPower: Nat; voteThresholdPercentage: Nat; maxVotingPowerPercentage: Nat } {
    { paused; totalVotingPower; voteThresholdPercentage; maxVotingPowerPercentage }
  };
}
