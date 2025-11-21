import Debug "mo:debug";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor MetadataGovernance {

  // Simple local stub to record metadata publish proposals.
  // In production, integrate with existing governance canister.

  private var proposals : [ (Nat, Text, Text) ] = [];
  private var nextId : Nat = 1;

  public shared(msg) func proposeMetadataPublish(collectionId : Text, cid : Text, summary : Text) : async Nat {
    let id = nextId;
    proposals := Array.append(proposals, [(id, collectionId, cid)]);
    nextId += 1;
    Debug.print("Proposed metadata publish: " # Text.fromNat(id) # " cid=" # cid);
    id
  };

  public shared(msg) func executeMetadataPublish(proposalId : Nat) : async Bool {
    // very small simulation: check we have the proposal
    var found : Bool = false;
    var i : Nat = 0;
    while (i < proposals.size()) {
      let (pid, _cid, _c) = proposals[i];
      if (pid == proposalId) {
        found := true;
        break;
      };
      i += 1;
    };
    if (found) {
      Debug.print("Executing publish for proposal " # Text.fromNat(proposalId));
      true
    } else {
      Debug.print("Proposal not found: " # Text.fromNat(proposalId));
      false
    }
  };

  public query func listProposals() : async [ (Nat, Text, Text) ] {
    proposals
  };
};
