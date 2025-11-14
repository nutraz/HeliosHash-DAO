import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

module {
  public type ProposalId = Nat;
  public type Proposal = {
    id: ProposalId;
    title: Text;
    description: Text;
    proposer: Principal.Principal;
    votesYes: Nat.Nat;
    votesNo: Nat.Nat;
    executed: Bool;
    timestamp: Nat.Nat;
  };

  public type CreateProposalArgs = {
    title: Text;
    description: Text;
  };

  public type ProposalResult = Result.Result<ProposalId, Text>;

  persistent actor class Governance() {
    var nextId: ProposalId = 0;
    var proposals: List.List<Proposal> = List.nil();

    public shared(msg) func createProposal(args: CreateProposalArgs): async ProposalResult {
      let caller = msg.caller;
      if (Principal.isAnonymous(caller)) {
        return #err("Anonymous principals cannot create proposals");
      };

      let id = nextId;
      nextId += 1;

      let proposal: Proposal = {
        id = id;
        title = args.title;
        description = args.description;
        proposer = caller;
        votesYes = 0;
        votesNo = 0;
        executed = false;
        timestamp = 0; // TODO: use Time.now() in production
      };

      proposals := List.push(proposal, proposals);
      Debug.print("Proposal created: id=" # Nat.toText(id));
      #ok(id);
    };

    public query func getProposals(): async [Proposal] {
      List.toArray(proposals)
    };
  }
}
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

module {
  public type ProposalId = Nat;
  public type Proposal = {
    id: ProposalId;
    title: Text;
    description: Text;
    proposer: Principal.Principal;
    votesYes: Nat.Nat;
    votesNo: Nat.Nat;
    executed: Bool;
    timestamp: Nat.Nat;
  };

  public type CreateProposalArgs = {
    title: Text;
    description: Text;
  };

  public type ProposalResult = Result.Result<ProposalId, Text>;

  persistent actor class Governance() {
    var nextId: ProposalId = 0;
    var proposals: List.List<Proposal> = List.nil();

    public shared(msg) func createProposal(args: CreateProposalArgs): async ProposalResult {
      let caller = msg.caller;
      if (Principal.isAnonymous(caller)) {
        return #err("Anonymous principals cannot create proposals");
      };

      let id = nextId;
      nextId += 1;

      let proposal: Proposal = {
        id = id;
        title = args.title;
        description = args.description;
        proposer = caller;
        votesYes = 0;
        votesNo = 0;
        executed = false;
        timestamp = 0; // TODO: use Time.now() in production
      };

      proposals := List.push(proposal, proposals);
      Debug.print("Proposal created: id=" # Nat.toText(id));
      #ok(id);
    };

    public query func getProposals(): async [Proposal] {
      List.toArray(proposals)
    };
  }
}
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Text "mo:base/Text";

module {
  public type ProposalId = Nat;
  public type Proposal = {
    id: ProposalId;
    title: Text;
    description: Text;
    proposer: Principal.Principal;
    votesYes: Nat.Nat;
    votesNo: Nat.Nat;
    executed: Bool;
    timestamp: Nat.Nat;
  };

  public type CreateProposalArgs = {
    title: Text;
    description: Text;
  };

  public type ProposalResult = Result.Result<ProposalId, Text>;

  persistent actor class Governance() {
    var nextId: ProposalId = 0;
    var proposals: List.List<Proposal> = List.nil();

    public shared(msg) func createProposal(args: CreateProposalArgs): async ProposalResult {
      let caller = msg.caller;
      if (Principal.isAnonymous(caller)) {
        return #err("Anonymous principals cannot create proposals");
      };

      let id = nextId;
      nextId += 1;

      let proposal: Proposal = {
        id = id;
        title = args.title;
        description = args.description;
        proposer = caller;
        votesYes = 0;
        votesNo = 0;
        executed = false;
        timestamp = 0; // TODO: use Time.now() in production
      };

      proposals := List.push(proposal, proposals);
      Debug.print("Proposal created: id=" # Nat.toText(id));
      #ok(id);
    };

    public query func getProposals(): async [Proposal] {
      List.toArray(proposals)
    };
  }
}
