import Debug "mo:debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";

/// Minimal NFT Project canister stub for demo & integration.
persistent actor NFTProject {
  public type ProjectToken = {
    id: Nat;
    owner: Principal;
    projectId: Text;
    metadata: Blob;
    mintedAt: Time.Time;
  };

  private stable var tokens : [ProjectToken] = [];
  private stable var nextId : Nat = 1;

  public shared(msg) func mint(owner : Principal, projectId : Text, metadata : Blob) : async Nat {
    let t : ProjectToken = { id = nextId; owner = owner; projectId = projectId; metadata = metadata; mintedAt = Time.now() };
    tokens := Array.append(tokens, [t]);
    nextId += 1;
    Debug.print("minted project token id=" # Nat.toText(t.id));
    t.id
  };

  public shared(msg) func burn(tokenId : Nat) : async Bool {
    var out : [ProjectToken] = [];
    var i : Nat = 0;
    var removed : Bool = false;
    while (i < tokens.size()) {
      if (tokens[i].id == tokenId) {
        removed := true;
      } else {
        out := Array.append(out, [tokens[i]]);
      };
      i += 1;
    };
    tokens := out;
    removed
  };

  public shared(msg) func transfer(tokenId : Nat, to : Principal) : async Bool {
    var i : Nat = 0;
    var ok : Bool = false;
    while (i < tokens.size()) {
      if (tokens[i].id == tokenId) {
        tokens[i].owner := to;
        ok := true;
        break;
      };
      i += 1;
    };
    ok
  };

  public query func totalSupply() : async Nat {
    tokens.size()
  };

  public query func tokensByProject(projectId : Text) : async [ProjectToken] {
    var res : [ProjectToken] = [];
    var i : Nat = 0;
    while (i < tokens.size()) {
      if (tokens[i].projectId == projectId) {
        res := Array.append(res, [tokens[i]]);
      };
      i += 1;
    };
    res
  };
};
