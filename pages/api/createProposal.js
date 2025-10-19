import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../src/declarations/hhdao_dao';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication token
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    const userPrincipal = verifyToken(authToken); // Implement your token verification
    
    if (!userPrincipal) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Create agent with identity
    const agent = new HttpAgent({ host: 'https://ic0.app' });
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.GOVERNANCE_CANISTER_ID,
    });

    // Extract proposal data
    const { title, description, deadline } = req.body;

    // Call canister
    const proposalId = await actor.createProposal(title, description, BigInt(deadline));
    
    res.status(200).json({ proposalId: proposalId.toString() });
  } catch (error) {
    console.error('Error creating proposal:', error);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
}
