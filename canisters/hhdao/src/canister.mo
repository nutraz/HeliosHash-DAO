import HHDAOLib "lib";
import Principal "mo:base/Principal";

actor {
  private let state = HHDAOLib.HHDAOState();

  public shared func createProposal(proposal : {
    title : Text;
    description : Text;
    votesRequired : Nat;
    category : HHDAOLib.Category;
  }) : async Nat {
    state.createProposal(proposal);
  };

  public shared func vote(proposalId : Nat, inFavor : Bool) : async Bool {
    state.vote(proposalId, inFavor);
  };

  public query func getProposal(proposalId : Nat) : async ?HHDAOLib.Proposal {
    state.getProposal(proposalId);
  };

  public shared func mintMembershipNFT(request : {
    recipient : Principal;
    tier : HHDAOLib.MembershipTier;
    durationDays : Nat;
  }) : async HHDAOLib.MintResult {
    state.mintMembershipNFT(request);
  };

  public query func getNFTInfo(tokenId : Nat) : async ?HHDAOLib.NFT {
    state.getNFTInfo(tokenId);
  };
}
