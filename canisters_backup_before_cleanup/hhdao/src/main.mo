import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";

// Import your existing HHDAOLib types from local `lib.mo`
import HHDAOLib "lib";

persistent actor HHDAO {

    // Example stable state
    stable var proposals : [HHDAOLib.Proposal] = [];
    stable var members : [Principal] = [];

    // Example public function to add a proposal
    public shared func addProposal(p : HHDAOLib.Proposal) : async Bool {
        proposals := Array.append(proposals, [p]);
        return true;
    };

    // Example public function to get all proposals
    public query func getProposals() : async [HHDAOLib.Proposal] {
        return proposals;
    };

    // Example public function to add a member
    public shared func addMember(m : Principal) : async Bool {
        members := Array.append(members, [m]);
        return true;
    };

    // Example public function to get all members
    public query func getMembers() : async [Principal] {
        return members;
    };

};
