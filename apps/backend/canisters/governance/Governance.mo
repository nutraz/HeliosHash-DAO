import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

actor class Governance() {
  public type ProposalId = Nat;
  public type Proposal = {
    id : ProposalId;
    title : Text;
    description : Text;
    proposer : Principal;
    votesYes : Nat;
    votesNo : Nat;
  };

  public type CreateProposalArgs = {
    title : Text;
    description : Text;
  };

  public type ProposalResult = Result.Result<ProposalId, Text>;

  var nextId : ProposalId = 0;
  var proposals : [var ?Proposal] = Array.init(100, null);

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
    };

    proposals[id] := ?proposal;
    Debug.print("Proposal created: id=" # Nat.toText(id));
    #ok(id);
  };

  public query func getProposals() : async [Proposal] {
    Array.tabulate<Proposal>(
      nextId,
      func(i : Nat) : Proposal {
        switch (proposals[i]) {
          case (?p) p;
          case null {
            {
              id = i;
              title = "";
              description = "";
              proposer = Principal.fromText("aaaaa-aa");
              votesYes = 0;
              votesNo = 0;
            }
          };
        }
      }
    )
  };

  public query func getProposal(proposalId : ProposalId) : async ?Proposal {
    if (proposalId < nextId) {
      proposals[proposalId];
    } else {
      null;
    }
  };
}
