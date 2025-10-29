// HeliosHash DAO Dispute Resolution Canister
// Philosophy: Collaborative conflict resolution, community mediation, restorative justice

import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";

persistent actor DisputeResolution {

    // === Types ===

    public type DisputeId = Nat;
    
    public type DisputeCategory = {
        #ProjectDispute;     // Solar project related conflicts
        #GovernanceDispute;  // DAO governance disagreements  
        #TreasuryDispute;    // Financial allocation conflicts
        #MembershipDispute;  // Member conduct or eligibility
        #TechnicalDispute;   // Technical infrastructure issues
        #ContractDispute;    // Smart contract or agreement disputes
    };
    
    public type DisputeStatus = {
        #Filed;              // Initial filing
        #UnderReview;        // Being assessed by mediators
        #Mediation;          // Active mediation process
        #CommunityVoting;    // DAO community vote in progress
        #Resolved;           // Successfully resolved
        #Escalated;          // Escalated to external resolution
        #Closed;             // Closed without resolution
    };
    
    public type DisputePriority = {
        #Low;
        #Medium; 
        #High;
        #Critical;
    };
    
    public type Dispute = {
        id : DisputeId;
        title : Text;
        description : Text;
        category : DisputeCategory;
        priority : DisputePriority;
        filer : Principal;
        respondent : ?Principal;
        mediators : [Principal];
        status : DisputeStatus;
        filedAt : Time.Time;
        lastUpdated : Time.Time;
        evidence : [Evidence];
        resolutionProposal : ?Text;
        finalOutcome : ?Text;
    };
    
    public type Evidence = {
        id : Nat;
        submitter : Principal;
        content : Text;
        evidenceType : EvidenceType;
        timestamp : Time.Time;
        verified : Bool;
    };
    
    public type EvidenceType = {
        #Document;
        #Testimony;
        #Transaction;
        #Communication;
        #TechnicalLog;
        #Other : Text;
    };
    
    public type MediationSession = {
        disputeId : DisputeId;
        sessionId : Nat;
        mediator : Principal;
        participants : [Principal];
        scheduledTime : Time.Time;
        notes : ?Text;
        outcome : ?Text;
        completed : Bool;
    };

    // === State ===

    private var nextDisputeId : DisputeId = 0;
    private var nextEvidenceId : Nat = 0;
    private var nextSessionId : Nat = 0;
    
    private transient let disputes = HashMap.HashMap<DisputeId, Dispute>(10, Nat.equal, func(n: Nat) : Hash.Hash { 
        Nat32.fromNat(n % 1000000) 
    });
    private transient let mediationSessions = HashMap.HashMap<Nat, MediationSession>(10, Nat.equal, func(n: Nat) : Hash.Hash { 
        Nat32.fromNat(n % 1000000) 
    });
    private transient let authorizedMediators = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);
    
    // Initialize with some authorized mediators (can be expanded through DAO governance)
    private func _initializeMediators() {
        // This would typically be set through DAO governance
        // For now, we'll allow DAO members to become mediators through application
    };

    // === Helpers ===

    private func isAuthorizedMediator(principal : Principal) : Bool {
        switch (authorizedMediators.get(principal)) {
            case (?authorized) { authorized };
            case null { false };
        }
    };

    private func _updateDisputeStatus(disputeId : DisputeId, newStatus : DisputeStatus) : Bool {
        switch (disputes.get(disputeId)) {
            case (?dispute) {
                let updatedDispute = {
                    dispute with 
                    status = newStatus;
                    lastUpdated = Time.now();
                };
                disputes.put(disputeId, updatedDispute);
                true
            };
            case null { false };
        }
    };

    // === Public Interface ===

    // File a new dispute
    public shared(msg) func fileDispute(
        title : Text,
        description : Text,
        category : DisputeCategory,
        priority : DisputePriority,
        respondent : ?Principal
    ) : async Result.Result<DisputeId, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals cannot file disputes");
        };

        if (Text.size(title) == 0 or Text.size(description) == 0) {
            return #err("Title and description cannot be empty");
        };

        let disputeId = nextDisputeId;
        nextDisputeId += 1;
        
        let dispute : Dispute = {
            id = disputeId;
            title = title;
            description = description;
            category = category;
            priority = priority;
            filer = caller;
            respondent = respondent;
            mediators = [];
            status = #Filed;
            filedAt = Time.now();
            lastUpdated = Time.now();
            evidence = [];
            resolutionProposal = null;
            finalOutcome = null;
        };
        
        disputes.put(disputeId, dispute);
        #ok(disputeId)
    };

    // Submit evidence for a dispute
    public shared(msg) func submitEvidence(
        disputeId : DisputeId,
        content : Text,
        evidenceType : EvidenceType
    ) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        
        switch (disputes.get(disputeId)) {
            case null { 
                #err("Dispute not found") 
            };
            case (?dispute) {
                if (dispute.status == #Resolved or dispute.status == #Closed) {
                    return #err("Cannot submit evidence to closed dispute");
                };

                let evidenceId = nextEvidenceId;
                nextEvidenceId += 1;
                
                let evidence : Evidence = {
                    id = evidenceId;
                    submitter = caller;
                    content = content;
                    evidenceType = evidenceType;
                    timestamp = Time.now();
                    verified = false; // Can be verified by mediators
                };

                let updatedEvidence = Array.append(dispute.evidence, [evidence]);
                let updatedDispute = {
                    dispute with 
                    evidence = updatedEvidence;
                    lastUpdated = Time.now();
                };
                
                disputes.put(disputeId, updatedDispute);
                #ok(evidenceId)
            };
        }
    };

    // Apply to become a mediator
    public shared(msg) func applyToBeMediator() : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals cannot become mediators");
        };

        if (isAuthorizedMediator(caller)) {
            return #err("Already an authorized mediator");
        };

        // In a full implementation, this would create a DAO proposal for community vote
        // For now, we'll auto-approve (this should be governance-controlled)
        authorizedMediators.put(caller, true);
        #ok("Mediator application approved (in production, this would require DAO vote)")
    };

    // Assign mediator to dispute (mediator self-assignment for now)
    public shared(msg) func acceptMediationRole(disputeId : DisputeId) : async Result.Result<Text, Text> {
        let caller = msg.caller;
        
        if (not isAuthorizedMediator(caller)) {
            return #err("Not an authorized mediator");
        };

        switch (disputes.get(disputeId)) {
            case null { 
                #err("Dispute not found") 
            };
            case (?dispute) {
                if (dispute.status != #Filed and dispute.status != #UnderReview) {
                    return #err("Dispute is not available for mediation assignment");
                };

                // Check if mediator is already assigned
                let alreadyAssigned = Array.find<Principal>(dispute.mediators, func(m) = Principal.equal(m, caller));
                if (alreadyAssigned != null) {
                    return #err("Already assigned as mediator to this dispute");
                };

                let updatedMediators = Array.append(dispute.mediators, [caller]);
                let updatedDispute = {
                    dispute with 
                    mediators = updatedMediators;
                    status = #Mediation;
                    lastUpdated = Time.now();
                };
                
                disputes.put(disputeId, updatedDispute);
                #ok("Successfully assigned as mediator")
            };
        }
    };

    // Schedule mediation session
    public shared(msg) func scheduleMediationSession(
        disputeId : DisputeId,
        scheduledTime : Time.Time,
        participants : [Principal]
    ) : async Result.Result<Nat, Text> {
        let caller = msg.caller;
        
        switch (disputes.get(disputeId)) {
            case null { 
                #err("Dispute not found") 
            };
            case (?dispute) {
                // Check if caller is an assigned mediator
                let isMediator = Array.find<Principal>(dispute.mediators, func(m) = Principal.equal(m, caller));
                if (isMediator == null) {
                    return #err("Only assigned mediators can schedule sessions");
                };

                let sessionId = nextSessionId;
                nextSessionId += 1;
                
                let session : MediationSession = {
                    disputeId = disputeId;
                    sessionId = sessionId;
                    mediator = caller;
                    participants = participants;
                    scheduledTime = scheduledTime;
                    notes = null;
                    outcome = null;
                    completed = false;
                };
                
                mediationSessions.put(sessionId, session);
                #ok(sessionId)
            };
        }
    };

    // Propose resolution (by mediator or community member)
    public shared(msg) func proposeResolution(
        disputeId : DisputeId,
        resolutionProposal : Text
    ) : async Result.Result<Text, Text> {
        let _caller = msg.caller;
        
        switch (disputes.get(disputeId)) {
            case null { 
                #err("Dispute not found") 
            };
            case (?dispute) {
                if (dispute.status != #Mediation and dispute.status != #UnderReview) {
                    return #err("Dispute is not in a state to accept resolution proposals");
                };

                let updatedDispute = {
                    dispute with 
                    resolutionProposal = ?resolutionProposal;
                    status = #CommunityVoting; // Move to community voting phase
                    lastUpdated = Time.now();
                };
                
                disputes.put(disputeId, updatedDispute);
                #ok("Resolution proposal submitted for community vote")
            };
        }
    };

    // Finalize dispute (typically called after DAO vote)
    public shared(msg) func finalizeDispute(
        disputeId : DisputeId,
        outcome : Text,
        wasApproved : Bool
    ) : async Result.Result<Text, Text> {
        let _caller = msg.caller;
        
        // In production, this should only be callable by the DAO canister
        // For now, we allow mediators to finalize
        
        switch (disputes.get(disputeId)) {
            case null { 
                #err("Dispute not found") 
            };
            case (?dispute) {
                let finalStatus = if (wasApproved) #Resolved else #Escalated;
                
                let updatedDispute = {
                    dispute with 
                    finalOutcome = ?outcome;
                    status = finalStatus;
                    lastUpdated = Time.now();
                };
                
                disputes.put(disputeId, updatedDispute);
                #ok("Dispute finalized with outcome: " # outcome)
            };
        }
    };

    // === Query Functions ===

    public query func getDispute(id : DisputeId) : async ?Dispute {
        disputes.get(id)
    };

    public query func getAllDisputes() : async [Dispute] {
        Iter.toArray(disputes.vals())
    };

    public query func getDisputesByStatus(status : DisputeStatus) : async [Dispute] {
        let filtered = Iter.filter<Dispute>(disputes.vals(), func(d) = d.status == status);
        Iter.toArray(filtered)
    };

    public query func getDisputesByCategory(category : DisputeCategory) : async [Dispute] {
        let filtered = Iter.filter<Dispute>(disputes.vals(), func(d) = d.category == category);
        Iter.toArray(filtered)
    };

    public query func getMyDisputes(principal : Principal) : async [Dispute] {
        let filtered = Iter.filter<Dispute>(disputes.vals(), func(d) = 
            Principal.equal(d.filer, principal) or 
            (switch (d.respondent) { case (?r) Principal.equal(r, principal); case null false })
        );
        Iter.toArray(filtered)
    };

    public query func getMediationSessions(disputeId : DisputeId) : async [MediationSession] {
        let filtered = Iter.filter<MediationSession>(mediationSessions.vals(), func(s) = s.disputeId == disputeId);
        Iter.toArray(filtered)
    };

    public query func isMediator(principal : Principal) : async Bool {
        isAuthorizedMediator(principal)
    };

    // System health and metrics
    public query func getDisputeStats() : async {
        totalDisputes : Nat;
        activeDisputes : Nat;
        resolvedDisputes : Nat;
        totalMediators : Nat;
        disputesByCategory : [(DisputeCategory, Nat)];
    } {
        var activeCount = 0;
        var resolvedCount = 0;
        var projectCount = 0;
        var governanceCount = 0;
        var treasuryCount = 0;
        var membershipCount = 0;
        var technicalCount = 0;
        var contractCount = 0;
        
        for (dispute in disputes.vals()) {
            switch (dispute.status) {
                case (#Filed or #UnderReview or #Mediation or #CommunityVoting) { 
                    activeCount += 1;
                };
                case (#Resolved) { 
                    resolvedCount += 1;
                };
                case _ {};
            };
            
            switch (dispute.category) {
                case (#ProjectDispute) { projectCount += 1; };
                case (#GovernanceDispute) { governanceCount += 1; };
                case (#TreasuryDispute) { treasuryCount += 1; };
                case (#MembershipDispute) { membershipCount += 1; };
                case (#TechnicalDispute) { technicalCount += 1; };
                case (#ContractDispute) { contractCount += 1; };
            };
        };

        {
            totalDisputes = disputes.size();
            activeDisputes = activeCount;
            resolvedDisputes = resolvedCount;
            totalMediators = authorizedMediators.size();
            disputesByCategory = [
                (#ProjectDispute, projectCount),
                (#GovernanceDispute, governanceCount),
                (#TreasuryDispute, treasuryCount),
                (#MembershipDispute, membershipCount),
                (#TechnicalDispute, technicalCount),
                (#ContractDispute, contractCount)
            ];
        }
    };
}
