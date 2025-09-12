

import HHDAOLib "lib";
import Principal "mo:base/Principal";


persistent actor {
	public shared ({ caller }) func createProject(
		name : Text,
		location : Text,
		capacity : Nat,
		description : Text,
		estimatedCost : Nat,
		completionDate : ?Int
	) : async HHDAOLib.Project {
		state.createProject(name, location, capacity, description, estimatedCost, completionDate, caller)
	};

	public query func getProjects() : async [HHDAOLib.Project] {
		state.getProjects()
	};

	public query func getProject(id : Nat) : async ?HHDAOLib.Project {
		state.getProject(id)
	};

	public shared ({ caller }) func updateProjectStatus(
		id : Nat,
		status : HHDAOLib.ProjectStatus
	) : async Bool {
		state.updateProjectStatus(id, status, caller)
	};
	private transient let state = HHDAOLib.HHDAOState();

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
