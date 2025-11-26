import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

// Simple version without stable variables for now
persistent actor Governance {
  public type Proposal = {
    id : Nat;
    title : Text;
    description : Text;
    proposer : Principal;
    timestamp : Int;
    votesFor : Nat;
    votesAgainst : Nat;
    executed : Bool;
  };

  transient var nextProposalId : Nat = 1;
  transient var proposals : [Proposal] = [];

  public query func getProposals() : async [Proposal] {
    return proposals;
  };

  public shared ({ caller }) func createProposal(title : Text, description : Text) : async Text {
    let proposal : Proposal = {
      id = nextProposalId;
      title = title;
      description = description;
      proposer = caller;
      timestamp = Time.now();
      votesFor = 0;
      votesAgainst = 0;
      executed = false;
    };

    proposals := Array.append(proposals, [proposal]);
    nextProposalId += 1;

    return "Proposal created";
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Governance v1.0";
  };
}
