import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

persistent actor Governance {

  // === CONSTITUTIONAL CONSTANTS (IMMUTABLE) ===
  let MAJOR_DECISION_THRESHOLD : Nat = 66;
  let REVENUE_CHANGE_THRESHOLD : Nat = 75;
  let ROUTINE_DECISION_THRESHOLD : Nat = 50;
  let EMERGENCY_RATIFICATION_HOURS : Nat = 48;
  let WOMENS_QUOTA_MINIMUM : Nat = 33;
  let COMMUNITY_LEADERS_COUNT : Nat = 5;
  let MULTI_SIG_THRESHOLD : Nat = 3;
  let GUARANTEED_REVENUE_MIN : Nat = 60;
  let GUARANTEED_REVENUE_MAX : Nat = 70;
  let EDGE_COMPUTING_MIN : Nat = 20;
  let EDGE_COMPUTING_MAX : Nat = 30;
  let SPECULATIVE_MIN : Nat = 10;
  let SPECULATIVE_MAX : Nat = 20;
  let LARGE_TRANSACTION_THRESHOLD : Nat = 100000;
  let EMERGENCY_FUND_THRESHOLD : Nat = 500000;
  let BUDGET_VARIANCE_ALERT : Nat = 10;

  // === DATA TYPES ===
  public type Gender = { #Male; #Female; #Other; #PreferNotToSay };
  public type ProposalType = { #Constitutional; #Major; #Routine; #Emergency };
  public type LeadershipRole = { #SteeringCommittee; #PMOLead; #TechnicalCoordinator; #CommunityLiaison; #FinancialManager };
  public type Candidate = {
    principal : Principal;
    name : Text;
    gender : Gender;
    role : LeadershipRole;
    experience : Nat;
    communityEndorsements : Nat;
    aadhaarVerified : Bool;
    localResident : Bool;
  };
  public type ProposalStatus = { #Pending; #Active; #Passed; #Rejected; #Expired; #Executed };
  public type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposalType : ProposalType;
    proposer : Principal;
    createdAt : Int;
    votingDeadline : Int;
    votesFor : Nat;
    votesAgainst : Nat;
    totalVotes : Nat;
    status : ProposalStatus;
    requiredThreshold : Nat;
  };
  public type RevenueAllocation = { guaranteedRevenue : Nat; edgeComputing : Nat; speculative : Nat; total : Nat };
  public type GovernanceReport = {
    constitutionalCompliance : Bool;
    votingThresholdsValid : Bool;
    treasuryAllocationsValid : Bool;
    womensRepresentationValid : Bool;
    emergencyProtocolsActive : Bool;
    lastAuditDate : Int;
    complianceScore : Nat;
  };
  public type EmergencyType = { #NaturalDisaster; #GridFailure; #TechnicalFailure; #SecurityBreach; #CommunityEmergency };
  public type EmergencyStatus = { #Active; #PendingRatification; #Ratified; #Rejected; #Expired };
  public type EmergencyResponse = {
    emergencyType : EmergencyType;
    activatedAt : Int;
    activatedBy : Principal;
    resourceAllocation : Nat;
    ratificationDeadline : Int;
    status : EmergencyStatus;
  };

  // === STATE VARIABLES ===
  stable var proposalCounter : Nat = 0;
  stable var emergencyCounter : Nat = 0;
  stable var currentLeaders : [(Principal, LeadershipRole)] = [];
  transient var leadersMap = HashMap.HashMap<Principal, LeadershipRole>(10, Principal.equal, Principal.hash);

  stable var proposalEntries : [(Nat, Proposal)] = [];
  transient var proposals = HashMap.HashMap<Nat, Proposal>(50, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

  stable var emergencyEntries : [(Nat, EmergencyResponse)] = [];
  transient var emergencies = HashMap.HashMap<Nat, EmergencyResponse>(10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

  // === FUNCTIONS ===
  public shared ({ caller }) func enforceWomensQuota(candidates : [Candidate]) : async Result.Result<[Candidate], Text> {
    if (candidates.size() == 0) { return #err("No candidates provided") };
    let womenCount = Array.filter(candidates, func(c : Candidate) : Bool { switch (c.gender) { case (#Female) true; case _ false } }).size();
    let womenPercentage = (womenCount * 100) / candidates.size();
    if (womenPercentage < WOMENS_QUOTA_MINIMUM) {
      return #err("Women's representation below minimum");
    };
    #ok(candidates);
  };

  public shared ({ caller }) func validateVotingThreshold(proposalType : ProposalType, votesFor : Nat, totalVotes : Nat) : async Bool {
    if (totalVotes == 0) { return false };
    let percentage = (votesFor * 100) / totalVotes;
    switch (proposalType) {
      case (#Constitutional) { percentage >= REVENUE_CHANGE_THRESHOLD };
      case (#Major) { percentage >= MAJOR_DECISION_THRESHOLD };
      case (#Routine) { percentage >= ROUTINE_DECISION_THRESHOLD };
      case (#Emergency) { true };
    };
  };

  // TODO: Implement activateEmergencyProtocol, createProposal, electLeaders, queries here
  // Keep same logic as before but ensure they mutate transient maps and update stable arrays for upgrade safety

  // === QUERY FUNCTIONS ===
  public query func version() : async Text { "Governance v1.0" };
  public query func get_proposal_count() : async Nat { proposalCounter };
  public query func ping() : async Text { "pong" };

  // === PRE/POST-UPGRADE HOOKS ===
  system func preupgrade() {
    // Serialize transient maps to stable arrays
    currentLeaders := Iter.toArray(leadersMap.entries());
    proposalEntries := Iter.toArray(proposals.entries());
    emergencyEntries := Iter.toArray(emergencies.entries());
  };

  system func postupgrade() {
    // Restore transient maps from stable arrays
    leadersMap := HashMap.fromIter<Principal, LeadershipRole>(currentLeaders.vals(), 10, Principal.equal, Principal.hash);
    proposals := HashMap.fromIter<Nat, Proposal>(proposalEntries.vals(), 50, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    emergencies := HashMap.fromIter<Nat, EmergencyResponse>(emergencyEntries.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });

    // Clear temporary storage
    currentLeaders := [];
    proposalEntries := [];
    emergencyEntries := [];
  };
};
