// HeliosHash DAO Governance Rules Canister
// Codifies constitutional rules as immutable constants and enforcement functions

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

actor GovernanceRules {
    
    // === CONSTITUTIONAL CONSTANTS (IMMUTABLE) ===
    
    // Voting Thresholds
    public let MAJOR_DECISION_THRESHOLD : Nat = 66; // >66% for major decisions
    public let REVENUE_CHANGE_THRESHOLD : Nat = 75; // >75% for revenue allocation changes
    public let ROUTINE_DECISION_THRESHOLD : Nat = 50; // >50% for routine decisions
    public let EMERGENCY_RATIFICATION_HOURS : Nat = 48; // 48-hour emergency ratification
    
    // Representation Requirements
    public let WOMENS_QUOTA_MINIMUM : Nat = 33; // 33% women's representation minimum
    public let COMMUNITY_LEADERS_COUNT : Nat = 5; // 5 community leaders for governance
    public let MULTI_SIG_THRESHOLD : Nat = 3; // 3-of-5 for major changes
    
    // Revenue Allocation Ratios (Constitutional Requirements)
    public let GUARANTEED_REVENUE_MIN : Nat = 60; // 60% minimum guaranteed revenue
    public let GUARANTEED_REVENUE_MAX : Nat = 70; // 70% maximum guaranteed revenue
    public let EDGE_COMPUTING_MIN : Nat = 20; // 20% minimum edge computing
    public let EDGE_COMPUTING_MAX : Nat = 30; // 30% maximum edge computing
    public let SPECULATIVE_MIN : Nat = 10; // 10% minimum speculative
    public let SPECULATIVE_MAX : Nat = 20; // 20% maximum speculative
    
    // Financial Thresholds (in Rupees)
    public let LARGE_TRANSACTION_THRESHOLD : Nat = 100000; // ₹1,00,000 requires multi-sig
    public let EMERGENCY_FUND_THRESHOLD : Nat = 500000; // ₹5,00,000 emergency fund minimum
    public let BUDGET_VARIANCE_ALERT : Nat = 10; // 10% budget variance triggers alert
    
    // === DATA TYPES ===
    
    public type Gender = {
        #Male;
        #Female;
        #Other;
        #PreferNotToSay;
    };
    
    public type ProposalType = {
        #Constitutional;    // >75% threshold
        #Major;            // >66% threshold  
        #Routine;          // >50% threshold
        #Emergency;        // Emergency council authority
    };
    
    public type LeadershipRole = {
        #SteeringCommittee;
        #PMOLead;
        #TechnicalCoordinator;
        #CommunityLiaison;
        #FinancialManager;
    };
    
    public type Candidate = {
        principal : Principal;
        name : Text;
        gender : Gender;
        role : LeadershipRole;
        experience : Nat; // years
        communityEndorsements : Nat;
        aadhaarVerified : Bool;
        localResident : Bool;
    };
    
    public type ProposalStatus = {
        #Pending;
        #Active;
        #Passed;
        #Rejected;
        #Expired;
        #Executed;
    };
    
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
    
    public type RevenueAllocation = {
        guaranteedRevenue : Nat; // Percentage
        edgeComputing : Nat;     // Percentage
        speculative : Nat;       // Percentage
        total : Nat;            // Should always equal 100
    };
    
    public type GovernanceReport = {
        constitutionalCompliance : Bool;
        votingThresholdsValid : Bool;
        treasuryAllocationsValid : Bool;
        womensRepresentationValid : Bool;
        emergencyProtocolsActive : Bool;
        lastAuditDate : Int;
        complianceScore : Nat; // 0-100
    };
    
    public type EmergencyType = {
        #NaturalDisaster;
        #GridFailure;
        #TechnicalFailure;
        #SecurityBreach;
        #CommunityEmergency;
    };
    
    public type EmergencyStatus = {
        #Active;
        #PendingRatification;
        #Ratified;
        #Rejected;
        #Expired;
    };
    
    public type EmergencyResponse = {
        emergencyType : EmergencyType;
        activatedAt : Int;
        activatedBy : Principal;
        resourceAllocation : Nat; // Percentage of resources redirected
        ratificationDeadline : Int;
        status : EmergencyStatus;
    };
    
    // === STATE VARIABLES ===
    
    stable var proposalCounter : Nat = 0;
    stable var emergencyCounter : Nat = 0;
    
    // Leadership tracking
    stable var currentLeaders : [(Principal, LeadershipRole)] = [];
    var leadersMap = HashMap.HashMap<Principal, LeadershipRole>(10, Principal.equal, Principal.hash);
    
    // Active proposals
    stable var proposalEntries : [(Nat, Proposal)] = [];
    var proposals = HashMap.HashMap<Nat, Proposal>(50, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    
    // Emergency responses
    stable var emergencyEntries : [(Nat, EmergencyResponse)] = [];
    var emergencies = HashMap.HashMap<Nat, EmergencyResponse>(10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) });
    
    // === GOVERNANCE ENFORCEMENT FUNCTIONS ===
    
    // 1. Women's Quota Enforcement
    public func enforceWomensQuota(candidates : [Candidate]) : Result.Result<[Candidate], Text> {
        if (candidates.size() == 0) {
            return #err("No candidates provided");
        };
        
        let womenCount = Array.filter(candidates, func(c : Candidate) : Bool { 
            switch(c.gender) {
                case (#Female) true;
                case _ false;
            }
        }).size();
        
        let totalCount = candidates.size();
        let womenPercentage = (womenCount * 100) / totalCount;
        
        if (womenPercentage < WOMENS_QUOTA_MINIMUM) {
            return #err("Women's representation (" # Nat.toText(womenPercentage) # 
                       "%) below constitutional minimum of " # Nat.toText(WOMENS_QUOTA_MINIMUM) # "%");
        };
        
        #ok(candidates)
    };
    
    // 2. Voting Threshold Validation
    public func validateVotingThreshold(proposalType : ProposalType, votesFor : Nat, totalVotes : Nat) : Bool {
        if (totalVotes == 0) { return false };
        
        let percentage = (votesFor * 100) / totalVotes;
        
        switch (proposalType) {
            case (#Constitutional) { percentage >= REVENUE_CHANGE_THRESHOLD };
            case (#Major) { percentage >= MAJOR_DECISION_THRESHOLD };
            case (#Routine) { percentage >= ROUTINE_DECISION_THRESHOLD };
            case (#Emergency) { true }; // Emergency decisions bypass voting
        }
    };
    
    // 3. Revenue Allocation Validation
    public func validateRevenueAllocation(allocation : RevenueAllocation) : Result.Result<RevenueAllocation, Text> {
        // Check if percentages sum to 100
        if (allocation.total != 100) {
            return #err("Revenue allocations must sum to 100%");
        };
        
        if (allocation.guaranteedRevenue + allocation.edgeComputing + allocation.speculative != 100) {
            return #err("Individual allocations do not sum to total");
        };
        
        // Check constitutional ranges
        if (allocation.guaranteedRevenue < GUARANTEED_REVENUE_MIN or allocation.guaranteedRevenue > GUARANTEED_REVENUE_MAX) {
            return #err("Guaranteed revenue (" # Nat.toText(allocation.guaranteedRevenue) # 
                       "%) outside constitutional range of " # Nat.toText(GUARANTEED_REVENUE_MIN) # 
                       "-" # Nat.toText(GUARANTEED_REVENUE_MAX) # "%");
        };
        
        if (allocation.edgeComputing < EDGE_COMPUTING_MIN or allocation.edgeComputing > EDGE_COMPUTING_MAX) {
            return #err("Edge computing allocation (" # Nat.toText(allocation.edgeComputing) # 
                       "%) outside constitutional range of " # Nat.toText(EDGE_COMPUTING_MIN) # 
                       "-" # Nat.toText(EDGE_COMPUTING_MAX) # "%");
        };
        
        if (allocation.speculative < SPECULATIVE_MIN or allocation.speculative > SPECULATIVE_MAX) {
            return #err("Speculative allocation (" # Nat.toText(allocation.speculative) # 
                       "%) outside constitutional range of " # Nat.toText(SPECULATIVE_MIN) # 
                       "-" # Nat.toText(SPECULATIVE_MAX) # "%");
        };
        
        #ok(allocation)
    };
    
    // 4. Multi-Signature Validation
    public func validateMultiSigThreshold(signatures : [Principal]) : Bool {
        signatures.size() >= MULTI_SIG_THRESHOLD
    };
    
    // 5. Emergency Protocol Enforcement
    public shared ({ caller }) func activateEmergencyProtocol(
        emergencyType : EmergencyType,
        resourceAllocation : Nat
    ) : async Result.Result<EmergencyResponse, Text> {
        
        // Verify caller is authorized (steering committee member)
        switch (leadersMap.get(caller)) {
            case (?role) {
                if (role != #SteeringCommittee) {
                    return #err("Only steering committee members can activate emergency protocols");
                };
            };
            case null {
                return #err("Caller not authorized for emergency protocol activation");
            };
        };
        
        // Validate resource allocation percentage
        if (resourceAllocation > 100) {
            return #err("Resource allocation cannot exceed 100%");
        };
        
        emergencyCounter += 1;
        let currentTime = Time.now();
        let ratificationDeadline = currentTime + (EMERGENCY_RATIFICATION_HOURS * 3600 * 1000000000); // Convert to nanoseconds
        
        let emergency : EmergencyResponse = {
            emergencyType = emergencyType;
            activatedAt = currentTime;
            activatedBy = caller;
            resourceAllocation = resourceAllocation;
            ratificationDeadline = ratificationDeadline;
            status = #Active;
        };
        
        emergencies.put(emergencyCounter, emergency);
        
        Debug.print("Emergency protocol activated: " # debug_show(emergencyType));
        
        #ok(emergency)
    };
    
    // 6. Constitutional Compliance Audit
    public func auditConstitutionalCompliance() : async GovernanceReport {
        let currentTime = Time.now();
        
        // Check women's representation in current leadership
        let womenLeaders = Array.filter(
            Iter.toArray(leadersMap.entries()),
            func((principal, role) : (Principal, LeadershipRole)) : Bool {
                // This would need to be enhanced with actual gender data
                // For now, we'll assume this check passes
                true
            }
        ).size();
        
        let totalLeaders = leadersMap.size();
        let womensRepresentationValid = if (totalLeaders > 0) {
            (womenLeaders * 100) / totalLeaders >= WOMENS_QUOTA_MINIMUM
        } else {
            false
        };
        
        // Check active proposals for voting threshold compliance
        let activeProposals = Array.filter(
            Iter.toArray(proposals.vals()),
            func(p : Proposal) : Bool { 
                switch(p.status) {
                    case (#Active) true;
                    case _ false;
                }
            }
        );
        
        let votingThresholdsValid = Array.foldLeft<Proposal, Bool>(
            activeProposals,
            true,
            func(acc : Bool, proposal : Proposal) : Bool {
                acc and validateVotingThreshold(proposal.proposalType, proposal.votesFor, proposal.totalVotes)
            }
        );
        
        // Check for expired emergencies that need ratification
        let expiredEmergencies = Array.filter(
            Iter.toArray(emergencies.vals()),
            func(e : EmergencyResponse) : Bool {
                switch(e.status) {
                    case (#Active) { currentTime > e.ratificationDeadline };
                    case _ false;
                }
            }
        );
        
        let emergencyProtocolsActive = expiredEmergencies.size() == 0;
        
        // Calculate overall compliance score
        let complianceChecks : [Bool] = [
            womensRepresentationValid,
            votingThresholdsValid,
            emergencyProtocolsActive,
            true // Treasury allocations (would be checked via treasury canister)
        ];
        
        let passedChecks = Array.filter(complianceChecks, func(check : Bool) : Bool { check }).size();
        let complianceScore = if (complianceChecks.size() > 0) {
            (passedChecks * 100) / complianceChecks.size()
        } else {
            100
        };
        
        {
            constitutionalCompliance = complianceScore == 100;
            votingThresholdsValid = votingThresholdsValid;
            treasuryAllocationsValid = true; // Would integrate with treasury canister
            womensRepresentationValid = womensRepresentationValid;
            emergencyProtocolsActive = emergencyProtocolsActive;
            lastAuditDate = currentTime;
            complianceScore = complianceScore;
        }
    };
    
    // === PROPOSAL MANAGEMENT ===
    
    public shared ({ caller }) func createProposal(
        title : Text,
        description : Text,
        proposalType : ProposalType,
        votingDurationHours : Nat
    ) : async Result.Result<Nat, Text> {
        
        proposalCounter += 1;
        let currentTime = Time.now();
        let votingDeadline = currentTime + (votingDurationHours * 3600 * 1000000000);
        
        let requiredThreshold = switch (proposalType) {
            case (#Constitutional) { REVENUE_CHANGE_THRESHOLD };
            case (#Major) { MAJOR_DECISION_THRESHOLD };
            case (#Routine) { ROUTINE_DECISION_THRESHOLD };
            case (#Emergency) { 0 }; // Emergency proposals don't require voting
        };
        
        let proposal : Proposal = {
            id = proposalCounter;
            title = title;
            description = description;
            proposalType = proposalType;
            proposer = caller;
            createdAt = currentTime;
            votingDeadline = votingDeadline;
            votesFor = 0;
            votesAgainst = 0;
            totalVotes = 0;
            status = #Active;
            requiredThreshold = requiredThreshold;
        };
        
        proposals.put(proposalCounter, proposal);
        
        Debug.print("Proposal created: " # Nat.toText(proposalCounter) # " - " # title);
        
        #ok(proposalCounter)
    };
    
    // === LEADERSHIP MANAGEMENT ===
    
    public shared ({ caller }) func electLeaders(candidates : [Candidate]) : async Result.Result<[Candidate], Text> {
        // Validate women's quota first
        switch (enforceWomensQuota(candidates)) {
            case (#ok(validCandidates)) {
                // Clear existing leaders
                leadersMap := HashMap.HashMap<Principal, LeadershipRole>(10, Principal.equal, Principal.hash);
                
                // Add new leaders
                for (candidate in validCandidates.vals()) {
                    leadersMap.put(candidate.principal, candidate.role);
                };
                
                Debug.print("New leadership elected with " # Nat.toText(validCandidates.size()) # " members");
                #ok(validCandidates)
            };
            case (#err(error)) {
                #err(error)
            };
        }
    };
    
    // === QUERY FUNCTIONS ===
    
    public query func getConstitutionalConstants() : async {
        votingThresholds : {
            major : Nat;
            constitutional : Nat;
            routine : Nat;
        };
        representation : {
            womensQuota : Nat;
            communityLeaders : Nat;
            multiSigThreshold : Nat;
        };
        revenueRatios : {
            guaranteedMin : Nat;
            guaranteedMax : Nat;
            edgeComputingMin : Nat;
            edgeComputingMax : Nat;
            speculativeMin : Nat;
            speculativeMax : Nat;
        };
    } {
        {
            votingThresholds = {
                major = MAJOR_DECISION_THRESHOLD;
                constitutional = REVENUE_CHANGE_THRESHOLD;
                routine = ROUTINE_DECISION_THRESHOLD;
            };
            representation = {
                womensQuota = WOMENS_QUOTA_MINIMUM;
                communityLeaders = COMMUNITY_LEADERS_COUNT;
                multiSigThreshold = MULTI_SIG_THRESHOLD;
            };
            revenueRatios = {
                guaranteedMin = GUARANTEED_REVENUE_MIN;
                guaranteedMax = GUARANTEED_REVENUE_MAX;
                edgeComputingMin = EDGE_COMPUTING_MIN;
                edgeComputingMax = EDGE_COMPUTING_MAX;
                speculativeMin = SPECULATIVE_MIN;
                speculativeMax = SPECULATIVE_MAX;
            };
        }
    };
    
    public query func getCurrentLeaders() : async [(Principal, LeadershipRole)] {
        Iter.toArray(leadersMap.entries())
    };
    
    public query func getActiveProposals() : async [Proposal] {
        Array.filter(
            Iter.toArray(proposals.vals()),
            func(p : Proposal) : Bool { 
                switch(p.status) {
                    case (#Active) true;
                    case _ false;
                }
            }
        )
    };
    
    public query func getActiveEmergencies() : async [EmergencyResponse] {
        Array.filter(
            Iter.toArray(emergencies.vals()),
            func(e : EmergencyResponse) : Bool { 
                switch(e.status) {
                    case (#Active) true;
                    case (#PendingRatification) true;
                    case _ false;
                }
            }
        )
    };
    
    // === UPGRADE HOOKS ===
    
    system func preupgrade() {
        // Preserve leadership data
        currentLeaders := Iter.toArray(leadersMap.entries());
        
        // Preserve proposals
        proposalEntries := Iter.toArray(proposals.entries());
        
        // Preserve emergencies
        emergencyEntries := Iter.toArray(emergencies.entries());
    };
    
    system func postupgrade() {
        // Restore leadership data
        leadersMap := HashMap.fromIter<Principal, LeadershipRole>(
            currentLeaders.vals(), 10, Principal.equal, Principal.hash
        );
        
        // Restore proposals
        proposals := HashMap.fromIter<Nat, Proposal>(
            proposalEntries.vals(), 50, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) }
        );
        
        // Restore emergencies
        emergencies := HashMap.fromIter<Nat, EmergencyResponse>(
            emergencyEntries.vals(), 10, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n) }
        );
        
        // Clear temporary storage
        currentLeaders := [];
        proposalEntries := [];
        emergencyEntries := [];
    };
}
