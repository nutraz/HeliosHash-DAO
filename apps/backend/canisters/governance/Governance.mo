import Array "mo:base/Array";

persistent actor Governance {
  // Basic types
  public type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    votesFor : Nat;
    votesAgainst : Nat;
    status : Text;
  };

  public type Member = {
    id : Principal;
    name : Text;
    joined : Int;
  };

  // State - using stable vars for persistence
  stable var nextProposalId : Nat = 1;
  stable var proposals : [Proposal] = [];
  stable var members : [Member] = [];

  // Public queries
  public query func getVersion() : async Text {
    return "HeliosHash DAO Governance v1.0";
  };

  public query func getProposals() : async [Proposal] {
    return proposals;
  };

  public query func getMembers() : async [Member] {
    return members;
  };

  public query func getProposal(id : Nat) : async ?Proposal {
    return Array.find(proposals, func(p : Proposal) : Bool { p.id == id });
  };

  // Public updates
  public shared ({ caller }) func createProposal(title : Text, description : Text) : async Nat {
    let proposal : Proposal = {
      id = nextProposalId;
      title = title;
      description = description;
      votesFor = 0;
      votesAgainst = 0;
      status = "open";
    };
    
    proposals := Array.append(proposals, [proposal]);
    nextProposalId += 1;
    
    return proposal.id;
  };

  public shared ({ caller }) func vote(proposalId : Nat, support : Bool) : async Bool {
    switch (Array.find(proposals, func(p : Proposal) : Bool { p.id == proposalId })) {
      case (null) { return false };
      case (?proposal) {
        let updatedProposal = if (support) {
          { proposal with votesFor = proposal.votesFor + 1 }
        } else {
          { proposal with votesAgainst = proposal.votesAgainst + 1 }
        };
        
        // Update the proposal in the array
        proposals := Array.map(proposals, func(p : Proposal) : Proposal {
          if (p.id == proposalId) { updatedProposal } else { p }
        });
        
        return true;
      };
    };
  };

  // Initialize with some test data
  public func init() : async () {
    let testProposal : Proposal = {
      id = 0;
      title = "Welcome to HeliosHash DAO";
      description = "First proposal to test the governance system";
      votesFor = 1;
      votesAgainst = 0;
      status = "passed";
    };
    
    proposals := [testProposal];
    nextProposalId := 1;
  };
}
