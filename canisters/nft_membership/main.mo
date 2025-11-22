import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";

/// Minimal NFT Membership canister stub for demo and integration.
persistent actor NFTMembership {

  public type Token = {
    id: Nat;
    owner: Principal;
    tier: Nat;
    metadata: Blob;
    mintedAt: Time.Time;
  };

  private var tokens : [Token] = [];
  private var nextId : Nat = 1;

  public shared(msg) func mint(owner : Principal, tier : Nat, metadata : Blob) : async Bool {
    let t : Token = { id = nextId; owner = owner; tier = tier; metadata = metadata; mintedAt = Time.now() };
    tokens := Array.append(tokens, [t]);
    nextId += 1;
    Debug.print("minted token id=" # Nat.toText(t.id));
    true
  };

  public shared(msg) func burn(tokenId : Nat) : async Bool {
    var i : Nat = 0;
    var removed : Bool = false;
    var out : [Token] = [];
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
    var out : [Token] = [];
    while (i < tokens.size()) {
      if (tokens[i].id == tokenId) {
        let modified : Token = { id = tokens[i].id; owner = to; tier = tokens[i].tier; metadata = tokens[i].metadata; mintedAt = tokens[i].mintedAt };
        out := Array.append(out, [modified]);
        ok := true;
      } else {
        out := Array.append(out, [tokens[i]]);
      };
      i += 1;
    };
    tokens := out;
    ok
  };

  public shared(msg) func burnForUpgrade(tokenId : Nat, targetTier : Nat) : async Bool {
    // simple demo: burn old token and mint new token with higher tier to same owner
    var owner : Principal = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
    var found : Bool = false;
    var i : Nat = 0;
    while (i < tokens.size()) {
      if (tokens[i].id == tokenId) {
        owner := tokens[i].owner;
        found := true;
      };
      i += 1;
    };
    if (not found) { return false };
    let _ = await burn(tokenId);
    // metadata left empty in demo
    let _ = await mint(owner, targetTier, Blob.fromArray([0]));
    true
  };

  public query func totalSupply() : async Nat {
    tokens.size()
  };

  public query func tierDistribution() : async [ (Nat, Nat) ] {
    // return array of (tier, count) for tiers 1..5
    var res : [ (Nat, Nat) ] = [];
    var t : Nat = 1;
    while (t <= 5) {
      var cnt : Nat = 0;
      var i : Nat = 0;
      while (i < tokens.size()) {
        if (tokens[i].tier == t) { cnt += 1 };
        i += 1;
      };
      res := Array.append(res, [(t, cnt)]);
      t += 1;
    };
    res
  };
}
