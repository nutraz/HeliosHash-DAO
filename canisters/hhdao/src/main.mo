import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Principal "mo:base/Principal";

// Import your existing HHDAOLib types from local `lib.mo`
import HHDAOLib "lib";

persistent actor HHDAO {

    // Example stable state
    stable var proposals : [HHDAOLib.Proposal] = [];
    stable var members : [Principal] = [];
    stable var owner : ?Principal = null;

    // Owner check shared by the stub mutators (C6): reject anonymous, reject
    // when no owner is configured, otherwise require caller == owner.
    private func isOwner(caller : Principal) : Bool {
        if (Principal.isAnonymous(caller)) { return false };
        switch (owner) {
            case (null) { false };
            case (?o) { caller == o };
        };
    };

    // Set / rotate the owner. Gated on IC controller authority
    // (ic0.is_controller), same model as Treasury C1 / HHU token C4.
    public shared ({ caller }) func setOwner(newOwner : Principal) : async Bool {
        if (not Principal.isController(caller)) { return false };
        if (Principal.isAnonymous(newOwner)) { return false };
        owner := ?newOwner;
        return true;
    };

    // Add a proposal. Owner/admin-gated (C6).
    public shared ({ caller }) func addProposal(p : HHDAOLib.Proposal) : async Bool {
        if (not isOwner(caller)) { return false };
        proposals := Array.append(proposals, [p]);
        return true;
    };

    // Example public function to get all proposals
    public query func getProposals() : async [HHDAOLib.Proposal] {
        return proposals;
    };

    // Add a member. Owner/admin-gated (C6).
    public shared ({ caller }) func addMember(m : Principal) : async Bool {
        if (not isOwner(caller)) { return false };
        members := Array.append(members, [m]);
        return true;
    };

    // Example public function to get all members
    public query func getMembers() : async [Principal] {
        return members;
    };

};
