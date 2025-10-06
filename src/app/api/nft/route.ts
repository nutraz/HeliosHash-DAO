import { NextResponse } from 'next/server';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  external_url?: string;
  animation_url?: string;
}

interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  metadata: NFTMetadata;
  price?: {
    amount: number;
    currency: string;
    listingType: 'fixed' | 'auction';
    auctionEndTime?: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'artwork' | 'utility' | 'membership';
  createdAt: string;
  updatedAt: string;
  transactionHash: string;
}

interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  bannerImage?: string;
  creator: string;
  totalSupply: number;
  mintedSupply: number;
  floorPrice?: {
    amount: number;
    currency: string;
  };
  volume24h: {
    amount: number;
    currency: string;
  };
  categories: string[];
  blockchain: string;
  createdAt: string;
}

/**
 * Handle GET requests for NFT-related data based on URL query parameters.
 *
 * Reads `userId`, `collectionId`, and `nftId` from the request URL and returns:
 * - a single NFT when `nftId` is present,
 * - a collection when `collectionId` is present,
 * - the NFTs owned by a user when `userId` is present,
 * - or a list of all collections when no specific parameter is provided.
 *
 * @param request - The incoming HTTP request whose URL query may include `userId`, `collectionId`, or `nftId`.
 * @returns A JSON object with `success: true` and `data` containing the requested resource (NFT, collection, array of NFTs, or array of collections) and related metadata (`count`, `message`), or `success: false` with an `error` and `message` when an internal error occurs (responds with HTTP status 500).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const collectionId = searchParams.get('collectionId');
    const nftId = searchParams.get('nftId');

    if (nftId) {
      // Get specific NFT details
      const nft: NFT = {
        id: 'nft_001',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890',
        owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        metadata: {
          name: 'Solar Pioneer',
          description:
            'Exclusive NFT for early supporters of HeliosHash DAO solar mining initiatives',
          image: 'https://api.helioshash.org/nft/1/image',
          attributes: [
            {
              trait_type: 'Rarity',
              value: 'Rare',
            },
            {
              trait_type: 'Category',
              value: 'Achievement',
            },
            {
              trait_type: 'Power Generation',
              value: '100+ MWh',
            },
            {
              trait_type: 'Member Since',
              value: '2023',
            },
          ],
          external_url: 'https://helioshash.org/nft/1',
        },
        rarity: 'rare',
        category: 'achievement',
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-10-01T00:00:00Z',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      };

      return NextResponse.json({
        success: true,
        data: nft,
        message: 'NFT details retrieved successfully',
      });
    }

    if (collectionId) {
      // Get collection details
      const collection: NFTCollection = {
        id: 'collection_001',
        name: 'HeliosHash Achievements',
        description:
          'A collection of achievement NFTs awarded to active contributors in the HeliosHash ecosystem',
        image: 'https://api.helioshash.org/collection/achievements/image',
        bannerImage: 'https://api.helioshash.org/collection/achievements/banner',
        creator: 'HeliosHash DAO',
        totalSupply: 1000,
        mintedSupply: 342,
        floorPrice: {
          amount: 0.5,
          currency: 'ETH',
        },
        volume24h: {
          amount: 2.5,
          currency: 'ETH',
        },
        categories: ['achievement', 'utility'],
        blockchain: 'Internet Computer',
        createdAt: '2023-09-01T00:00:00Z',
      };

      return NextResponse.json({
        success: true,
        data: collection,
        message: 'Collection details retrieved successfully',
      });
    }

    if (userId) {
      // Get user's NFTs
      const userNFTs: NFT[] = [
        {
          id: 'nft_001',
          tokenId: '1',
          contractAddress: '0x1234567890123456789012345678901234567890',
          owner: userId,
          metadata: {
            name: 'Solar Pioneer',
            description: 'Exclusive NFT for early supporters',
            image: 'https://api.helioshash.org/nft/1/image',
            attributes: [
              { trait_type: 'Rarity', value: 'Rare' },
              { trait_type: 'Category', value: 'Achievement' },
            ],
          },
          rarity: 'rare',
          category: 'achievement',
          createdAt: '2023-10-01T00:00:00Z',
          updatedAt: '2023-10-01T00:00:00Z',
          transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        },
        {
          id: 'nft_002',
          tokenId: '2',
          contractAddress: '0x1234567890123456789012345678901234567890',
          owner: userId,
          metadata: {
            name: 'Energy Producer',
            description: 'Awarded for generating 100+ MWh of clean energy',
            image: 'https://api.helioshash.org/nft/2/image',
            attributes: [
              { trait_type: 'Rarity', value: 'Epic' },
              { trait_type: 'Category', value: 'Achievement' },
            ],
          },
          rarity: 'epic',
          category: 'achievement',
          createdAt: '2023-11-15T00:00:00Z',
          updatedAt: '2023-11-15T00:00:00Z',
          transactionHash: '0x8765432109fedcba8765432109fedcba87654321',
        },
      ];

      return NextResponse.json({
        success: true,
        data: userNFTs,
        count: userNFTs.length,
        message: 'User NFTs retrieved successfully',
      });
    }

    // Get all collections
    const collections: NFTCollection[] = [
      {
        id: 'collection_001',
        name: 'HeliosHash Achievements',
        description: 'Achievement NFTs for ecosystem contributors',
        image: 'https://api.helioshash.org/collection/achievements/image',
        creator: 'HeliosHash DAO',
        totalSupply: 1000,
        mintedSupply: 342,
        floorPrice: { amount: 0.5, currency: 'ETH' },
        volume24h: { amount: 2.5, currency: 'ETH' },
        categories: ['achievement', 'utility'],
        blockchain: 'Internet Computer',
        createdAt: '2023-09-01T00:00:00Z',
      },
      {
        id: 'collection_002',
        name: 'Solar Art Collection',
        description: 'Unique digital artwork celebrating solar energy',
        image: 'https://api.helioshash.org/collection/art/image',
        creator: 'HeliosHash Artists',
        totalSupply: 500,
        mintedSupply: 127,
        floorPrice: { amount: 1.2, currency: 'ETH' },
        volume24h: { amount: 3.8, currency: 'ETH' },
        categories: ['artwork'],
        blockchain: 'Internet Computer',
        createdAt: '2023-10-01T00:00:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: collections,
      count: collections.length,
      message: 'NFT collections retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching NFT data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch NFT data',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle NFT-related POST actions: `mint`, `list`, and `transfer`.
 *
 * Expects a JSON body with `{ action, userId, nftData }` and returns a JSON response
 * describing the result or an error.
 *
 * @param request - Incoming HTTP request containing a JSON body with `action` (`'mint' | 'list' | 'transfer'`), `userId`, and `nftData`
 * @returns A JSON object with a `success` boolean and additional fields depending on the action:
 * - For `mint`: `data` containing the created NFT object and `message`.
 * - For `list`: `listingId`, `expiresAt` (or `null`), and `message`.
 * - For `transfer`: `transactionHash`, `fromAddress`, `toAddress`, and `message`.
 * - On validation errors: `error`, `message` with HTTP status 400.
 * - On unexpected failures: `error`, `message` with HTTP status 500.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, nftData } = body;

    if (action === 'mint') {
      // Validate minting data
      if (!userId || !nftData || !nftData.metadata) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
            message: 'Please provide userId and NFT metadata',
          },
          { status: 400 }
        );
      }

      // Simulate NFT minting
      // In real implementation, this would:
      // 1. Verify user eligibility
      // 2. Check minting requirements
      // 3. Process payment if applicable
      // 4. Mint NFT on blockchain
      // 5. Transfer to user's wallet

      const newNFT: Partial<NFT> = {
        id: `nft_${Date.now()}`,
        tokenId: Math.random().toString(36).substr(2, 9),
        contractAddress: '0x1234567890123456789012345678901234567890',
        owner: userId,
        metadata: nftData.metadata,
        rarity: nftData.rarity || 'common',
        category: nftData.category || 'achievement',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      };

      return NextResponse.json({
        success: true,
        data: newNFT,
        message: 'NFT minted successfully',
      });
    }

    if (action === 'list') {
      // Validate listing data
      if (!nftData?.tokenId || !nftData?.price) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
            message: 'Please provide tokenId and price information',
          },
          { status: 400 }
        );
      }

      // Simulate NFT listing
      return NextResponse.json({
        success: true,
        message: 'NFT listed successfully',
        listingId: `listing_${Date.now()}`,
        expiresAt: nftData.auctionEndTime || null,
      });
    }

    if (action === 'transfer') {
      // Validate transfer data
      if (!nftData?.tokenId || !nftData?.toAddress) {
        return NextResponse.json(
          {
            success: false,
            error: 'Missing required fields',
            message: 'Please provide tokenId and recipient address',
          },
          { status: 400 }
        );
      }

      // Simulate NFT transfer
      return NextResponse.json({
        success: true,
        message: 'NFT transferred successfully',
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        fromAddress: userId,
        toAddress: nftData.toAddress,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        message: 'Please specify a valid action (mint, list, or transfer)',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing NFT request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process NFT request',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}