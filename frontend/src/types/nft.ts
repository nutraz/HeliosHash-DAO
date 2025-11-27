export interface NFT {
  id: string;
  name: string;
  image: string;
  community?: string;
  projectId?: string;
  description?: string;
  attributes?: { trait_type: string; value: string }[];
  opensea?: { contract?: string; tokenId?: string };
}

export default NFT;
