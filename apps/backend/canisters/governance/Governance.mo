import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

actor class Governance() {
  public type ProposalId = Nat;
  public type Proposal = {
    id : ProposalId;
    title : Text;
    description : Text;
    proposer : Principal;
    votesYes : Nat;
    votesNo : Nat;
    executed : Bool;
    timestamp : Nat;
  };

  public type CreateProposalArgs = {
    title : Text;
    description : Text;
  };

  public type ProposalResult = Result.Result<ProposalId, Text>;
  public type VoteResult = Result.Result<(), Text>;

  var nextId : ProposalId = 0;
  
  // Use HashMap for efficient proposal lookup and updates
  let proposals = HashMap.HashMap<ProposalId, Proposal>(0, Nat.equal, func (x : Nat) { x });
  
  // Track which principals have voted on which proposals to prevent double-voting
  let votes = HashMap.HashMap<ProposalId, HashMap.HashMap<Principal, Bool>>(0, Nat.equal, func (x : Nat) { x });

  public shared (msg) func createProposal(args : CreateProposalArgs) : async ProposalResult {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot create proposals");
    };

    let id = nextId;
    nextId += 1;

    let proposal : Proposal = {
      id = id;
      title = args.title;
      description = args.description;
      proposer = caller;
      votesYes = 0;
      votesNo = 0;
      executed = false;
      timestamp = 0;
    };

    proposals.put(id, proposal);
    Debug.print("Proposal created: id=" # Nat.toText(id) # ", title: " # args.title);
    #ok(id);
  };

  public query func getProposals() : async [Proposal] {
    Iter.toArray(proposals.vals());
  };

  public query func getProposal(proposalId : ProposalId) : async ?Proposal {
    proposals.get(proposalId);
  };

  public shared (msg) func vote(proposalId : ProposalId, approve : Bool) : async VoteResult {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot vote");
    };

    switch (proposals.get(proposalId)) {
      case (?proposal) {
        // Check if caller has already voted on this proposal
        switch (votes.get(proposalId)) {
          case (?proposalVotes) {
            if (proposalVotes.get(caller) != null) {
              return #err("You have already voted on this proposal");
            };
          };
          case null {};
        };

        // Update vote counts
        let updatedProposal = if (approve) {
          { proposal with votesYes = proposal.votesYes + 1 }
        } else {
          { proposal with votesNo = proposal.votesNo + 1 }
        };

        proposals.put(proposalId, updatedProposal);

        // Record that this principal has voted
        let proposalVotes = switch (votes.get(proposalId)) {
          case (?existing) existing;
          case null HashMap.HashMap<Principal, Bool>(0, Principal.equal, Principal.hash);
        };
        proposalVotes.put(caller, approve);
        votes.put(proposalId, proposalVotes);

        Debug.print("Vote recorded: proposal " # Nat.toText(proposalId) # 
                   ", approve: " # (if approve then "yes" else "no") # 
                   ", voter: " # Principal.toText(caller));
        #ok(());
      };
      case null {
        #err("Proposal not found");
      };
    };
  };

  public query func getVoteCounts(proposalId : ProposalId) : async ?{votesYes : Nat; votesNo : Nat} {
    switch (proposals.get(proposalId)) {
      case (?proposal) ?{votesYes = proposal.votesYes; votesNo = proposal.votesNo};
      case null null;
    };
  };
}
