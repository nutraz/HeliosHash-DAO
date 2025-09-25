import Time "mo:base/Time";
import Array "mo:base/Array";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Int "mo:base/Int";

persistent actor DAO {
    // Data Types
    public type ProposalType = {
        #Project;
        #Governance;
        #Treasury;
        #Community;
    };

    public type ProposalStatus = {
        #Active;
        #Passed;
        #Rejected;
        #Executed;
    };

    public type Proposal = {
        id: Nat;
        title: Text;
        description: Text;
        proposer: Principal;
        proposalType: ProposalType;
        votesFor: Nat;
        votesAgainst: Nat;
        status: ProposalStatus;
        createdAt: Int;
        votingDeadline: Int;
        executionData: ?Text;
    };

    public type Vote = {
        proposalId: Nat;
        voter: Principal;
        inFavor: Bool;
        votingPower: Nat;
        timestamp: Int;
    };

    public type Member = {
        principal: Principal;
        votingPower: Nat;
        joinedAt: Int;
        reputation: Nat;
    };

    // Stable storage
    stable var proposalCounter: Nat = 0;
    stable var proposalEntries: [(Nat, Proposal)] = [];
    stable var voteEntries: [(Text, Vote)] = []; // key: proposalId_voter
    stable var memberEntries: [(Principal, Member)] = [];

    // In-memory maps
    var proposals = Map.fromIter<Nat, Proposal>(proposalEntries.vals(), 10, func(n: Nat): Nat32 { Nat32.fromNat(n % 100000) }, func(a: Nat, b: Nat): Bool { a == b });
    var votes = Map.fromIter<Text, Vote>(voteEntries.vals(), 10, func(t: Text): Nat32 { 
        var hash: Nat32 = 0;
        for (char in t.chars()) {
            hash := hash * 31 + Nat32.fromNat(Nat32.toNat(Char.toNat32(char)));
        };
        hash;
    }, func(a: Text, b: Text): Bool { a == b });
    var members = Map.fromIter<Principal, Member>(memberEntries.vals(), 10, Principal.hash, Principal.equal);

    // System functions for upgrades
    system func preupgrade() {
        proposalEntries := Iter.toArray(proposals.entries());
        voteEntries := Iter.toArray(votes.entries());
        memberEntries := Iter.toArray(members.entries());
    };

    system func postupgrade() {
        proposalEntries := [];
        voteEntries := [];
        memberEntries := [];
    };

    // Helper functions
    func isValidMember(caller: Principal): Bool {
        switch (members.get(caller)) {
            case (?member) { true };
            case (null) { false };
        }
    };

    func getVoteKey(proposalId: Nat, voter: Principal): Text {
        Nat.toText(proposalId) # "_" # Principal.toText(voter)
    };

    // Public functions
    public shared ({ caller }) func joinDAO(): async Result.Result<Member, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principal cannot join DAO");
        };

        switch (members.get(caller)) {
            case (?existing) { #err("Already a member") };
            case (null) {
                let member: Member = {
                    principal = caller;
                    votingPower = 1; // Initial voting power
                    joinedAt = Time.now();
                    reputation = 0;
                };
                members.put(caller, member);
                #ok(member)
            };
        }
    };

    public shared ({ caller }) func createProposal(
        title: Text,
        description: Text,
        proposalType: ProposalType,
        votingDurationDays: Nat,
        executionData: ?Text
    ): async Result.Result<Nat, Text> {
        if (not isValidMember(caller)) {
            return #err("Only DAO members can create proposals");
        };

        proposalCounter += 1;
        let proposalId = proposalCounter;
        
        let proposal: Proposal = {
            id = proposalId;
            title = title;
            description = description;
            proposer = caller;
            proposalType = proposalType;
            votesFor = 0;
            votesAgainst = 0;
            status = #Active;
            createdAt = Time.now();
            votingDeadline = Time.now() + (votingDurationDays * 24 * 60 * 60 * 1_000_000_000);
            executionData = executionData;
        };

        proposals.put(proposalId, proposal);
        #ok(proposalId)
    };

    public shared ({ caller }) func vote(proposalId: Nat, inFavor: Bool): async Result.Result<Text, Text> {
        if (not isValidMember(caller)) {
            return #err("Only DAO members can vote");
        };

        let voteKey = getVoteKey(proposalId, caller);
        
        // Check if already voted
        switch (votes.get(voteKey)) {
            case (?existing) { return #err("Already voted on this proposal") };
            case (null) {};
        };

        // Get proposal
        switch (proposals.get(proposalId)) {
            case (null) { return #err("Proposal not found") };
            case (?proposal) {
                if (proposal.status != #Active) {
                    return #err("Voting is closed for this proposal");
                };

                if (Time.now() > proposal.votingDeadline) {
                    return #err("Voting deadline has passed");
                };

                // Get member voting power
                switch (members.get(caller)) {
                    case (null) { return #err("Member not found") };
                    case (?member) {
                        // Record vote
                        let vote: Vote = {
                            proposalId = proposalId;
                            voter = caller;
                            inFavor = inFavor;
                            votingPower = member.votingPower;
                            timestamp = Time.now();
                        };
                        votes.put(voteKey, vote);

                        // Update proposal vote counts
                        let updatedProposal = if (inFavor) {
                            {
                                proposal with
                                votesFor = proposal.votesFor + member.votingPower;
                            }
                        } else {
                            {
                                proposal with
                                votesAgainst = proposal.votesAgainst + member.votingPower;
                            }
                        };

                        proposals.put(proposalId, updatedProposal);
                        #ok("Vote recorded successfully")
                    };
                };
            };
        }
    };

    public query func getProposal(proposalId: Nat): async ?Proposal {
        proposals.get(proposalId)
    };

    public query func getActiveProposals(): async [Proposal] {
        let activeProposals = Array.filter<Proposal>(
            Iter.toArray(proposals.vals()),
            func(p: Proposal): Bool { p.status == #Active }
        );
        activeProposals
    };

    public query func getAllProposals(): async [Proposal] {
        Iter.toArray(proposals.vals())
    };

    public query func getMember(principal: Principal): async ?Member {
        members.get(principal)
    };

    public query func getAllMembers(): async [Member] {
        Iter.toArray(members.vals())
    };

    public query func getVotesForProposal(proposalId: Nat): async [Vote] {
        let allVotes = Iter.toArray(votes.vals());
        Array.filter<Vote>(allVotes, func(v: Vote): Bool { v.proposalId == proposalId })
    };

    public shared ({ caller }) func finalizeProposal(proposalId: Nat): async Result.Result<ProposalStatus, Text> {
        if (not isValidMember(caller)) {
            return #err("Only DAO members can finalize proposals");
        };

        switch (proposals.get(proposalId)) {
            case (null) { #err("Proposal not found") };
            case (?proposal) {
                if (proposal.status != #Active) {
                    return #err("Proposal is not active");
                };

                if (Time.now() <= proposal.votingDeadline) {
                    return #err("Voting deadline has not passed yet");
                };

                let newStatus = if (proposal.votesFor > proposal.votesAgainst) {
                    #Passed
                } else {
                    #Rejected
                };

                let updatedProposal = { proposal with status = newStatus };
                proposals.put(proposalId, updatedProposal);
                #ok(newStatus)
            };
        }
    };

    // Administrative functions
    public shared ({ caller }) func updateMemberVotingPower(member: Principal, newPower: Nat): async Result.Result<Text, Text> {
        // In a real implementation, this would have proper authorization checks
        switch (members.get(member)) {
            case (null) { #err("Member not found") };
            case (?existingMember) {
                let updatedMember = { existingMember with votingPower = newPower };
                members.put(member, updatedMember);
                #ok("Voting power updated")
            };
        }
    };

    public query func getDAOStats(): async {
        totalMembers: Nat;
        totalProposals: Nat;
        activeProposals: Nat;
        totalVotes: Nat;
    } {
        let activeCount = Array.filter<Proposal>(
            Iter.toArray(proposals.vals()),
            func(p: Proposal): Bool { p.status == #Active }
        ).size();

        {
            totalMembers = members.size();
            totalProposals = proposals.size();
            activeProposals = activeCount;
            totalVotes = votes.size();
        }
    };
}
