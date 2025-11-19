import Prim "mo:prim";

actor NFTMembership {
  // Example: NFT structure
  type NFT = {
    id: Nat;
    owner: Principal;
    metadata: Text;
  };

  stable var nfts: [NFT] = [];

  public func mintNFT(owner: Principal, metadata: Text): async Nat {
    let id = nfts.size();
    let nft = { id; owner; metadata };
    nfts := Array.append(nfts, [nft]);
    id
  };

  public query func getNFTs(): async [NFT] {
    nfts
  };
}
