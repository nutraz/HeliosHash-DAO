import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Nat "mo:base/Nat";

persistent actor MetadataGovernance {

  // Simple local stub to record metadata publish proposals.
  // In production, integrate with existing governance canister.

  private transient var proposals : [ (Nat, Text, Text) ] = [];
  private transient var nextId : Nat = 1;

  public shared(msg) func proposeMetadataPublish(collectionId : Text, cid : Text, summary : Text) : async Nat {
    let id = nextId;
    proposals := Array.append(proposals, [(id, collectionId, cid)]);
    nextId += 1;
    Debug.print("Proposed metadata publish: " # Nat.toText(id) # " cid=" # cid);
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
      };
      i += 1;
    };
    if (found) {
      Debug.print("Executing publish for proposal " # Nat.toText(proposalId));
      true
    } else {
      Debug.print("Proposal not found: " # Nat.toText(proposalId));
      false
    }
  };

  public query func listProposals() : async [ (Nat, Text, Text) ] {
    proposals
  };
}
