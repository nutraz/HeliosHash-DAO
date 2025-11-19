#!/usr/bin/env node

/**
 * HHDAO USSD/SMS Gateway Server
 * Enables offline participation in DAO governance via USSD/SMS
 * Integrates with Polygon DAO contract for vote submission
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crypto = require('crypto');
const { ethers } = require('ethers');

const app = express();
const port = process.env.USSD_PORT || 8080;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory storage for USSD sessions (use Redis in production)
const activeSessions = new Map();
const pendingVotes = new Map();

// Polygon DAO Contract Configuration
const DAO_CONTRACT_ADDRESS = '0xDaa7...F61e30'; // Replace with actual address
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://polygon-rpc.com';
const PRIVATE_KEY = process.env.PRIVATE_KEY; // For oracle operations

// Initialize ethers provider
const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
const wallet = PRIVATE_KEY ? new ethers.Wallet(PRIVATE_KEY, provider) : null;

// USSD Menu States
const MENU_STATES = {
  MAIN: 'main',
  PROPOSALS: 'proposals',
  VOTE: 'vote',
  CONFIRM: 'confirm',
  REGISTER: 'register',
  STATUS: 'status',
};

// USSD Session Management
class USSDSession {
  constructor(sessionId, phoneNumber) {
    this.sessionId = sessionId;
    this.phoneNumber = phoneNumber;
    this.state = MENU_STATES.MAIN;
    this.data = {};
    this.timestamp = Date.now();
  }
}

// Mock proposals (integrate with actual DAO contract)
const activeProposals = [
  {
    id: 1,
    title: 'Increase Solar Panel Efficiency Target',
    description: 'Proposal to upgrade solar panels for 15% efficiency gain',
    votesFor: 45,
    votesAgainst: 12,
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  {
    id: 2,
    title: 'Community Training Program',
    description: 'Fund training program for local technicians',
    votesFor: 38,
    votesAgainst: 8,
    endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
  },
];

// Generate secure vote hash for verification
function generateVoteHash(sessionId, proposalId, vote, timestamp) {
  return crypto
    .createHash('sha256')
    .update(
      `${sessionId}-${proposalId}-${vote}-${timestamp}-${process.env.VOTE_SALT || 'hhdao2025'}`
    )
    .digest('hex');
}

// Main USSD endpoint
app.post('/ussd/vote', async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Get or create session
    let session = activeSessions.get(sessionId);
    if (!session) {
      session = new USSDSession(sessionId, phoneNumber);
      activeSessions.set(sessionId, session);
    }

    const response = await processUSSDInput(session, text || '');

    // Update session
    activeSessions.set(sessionId, session);

    // Clean up old sessions (older than 1 hour)
    cleanOldSessions();

    res.send(response);
  } catch (error) {
    console.error('USSD Error:', error);
    res.send('END Service temporarily unavailable. Please try again later.');
  }
});

// Process USSD input based on session state
async function processUSSDInput(session, input) {
  const inputParts = input.split('*');
  const lastInput = inputParts[inputParts.length - 1] || '';

  switch (session.state) {
    case MENU_STATES.MAIN:
      return handleMainMenu(session, lastInput);

    case MENU_STATES.PROPOSALS:
      return handleProposalsMenu(session, lastInput);

    case MENU_STATES.VOTE:
      return handleVoteInput(session, lastInput);

    case MENU_STATES.CONFIRM:
      return await handleConfirmVote(session, lastInput);

    case MENU_STATES.REGISTER:
      return handleRegistration(session, lastInput);

    case MENU_STATES.STATUS:
      return handleStatusCheck(session, lastInput);

    default:
      session.state = MENU_STATES.MAIN;
      return handleMainMenu(session, '');
  }
}

// Main menu handler
function handleMainMenu(session, input) {
  if (input === '') {
    return `CON Welcome to HeliosHash DAO
1. View Proposals
2. Vote on Proposal
3. Check Vote Status
4. Register for DAO
5. Help
0. Exit`;
  }

  switch (input) {
    case '1':
      session.state = MENU_STATES.PROPOSALS;
      return handleProposalsMenu(session, '');

    case '2':
      session.state = MENU_STATES.VOTE;
      return handleVoteInput(session, '');

    case '3':
      session.state = MENU_STATES.STATUS;
      return handleStatusCheck(session, '');

    case '4':
      session.state = MENU_STATES.REGISTER;
      return handleRegistration(session, '');

    case '5':
      return `END Help: Call *123# for DAO voting
- Dial *123*1# to view proposals
- Dial *123*2# to vote
- SMS votes: "VOTE [ID] YES/NO" to 4567
Visit: urgam.community for more info`;

    case '0':
      return 'END Thank you for using HeliosHash DAO!';

    default:
      return `CON Invalid option. Please select:
1. View Proposals
2. Vote on Proposal
3. Check Vote Status
4. Register for DAO
0. Exit`;
  }
}

// Proposals menu handler
function handleProposalsMenu(session, input) {
  if (input === '') {
    let proposalsList = 'CON Active Proposals:\n';
    activeProposals.forEach((proposal, index) => {
      const daysLeft = Math.ceil((proposal.endTime - Date.now()) / (24 * 60 * 60 * 1000));
      proposalsList += `${proposal.id}. ${proposal.title.substring(0, 30)}...\n`;
      proposalsList += `   For: ${proposal.votesFor} Against: ${proposal.votesAgainst}\n`;
      proposalsList += `   Days left: ${daysLeft}\n\n`;
    });
    proposalsList += 'Enter proposal ID to vote, or 0 to return';
    return proposalsList;
  }

  const proposalId = parseInt(input);
  const proposal = activeProposals.find((p) => p.id === proposalId);

  if (proposal) {
    session.data.selectedProposal = proposalId;
    session.state = MENU_STATES.VOTE;
    return `CON Proposal ${proposalId}:
${proposal.title}

${proposal.description}

Current votes:
For: ${proposal.votesFor}
Against: ${proposal.votesAgainst}

Your vote:
1. Yes (Support)
2. No (Against)
0. Back to proposals`;
  } else if (input === '0') {
    session.state = MENU_STATES.MAIN;
    return handleMainMenu(session, '');
  } else {
    return 'CON Invalid proposal ID. Try again or press 0 to go back.';
  }
}

// Vote input handler
function handleVoteInput(session, input) {
  if (!session.data.selectedProposal) {
    return `CON Select proposal to vote on:
${activeProposals.map((p) => `${p.id}. ${p.title.substring(0, 40)}...`).join('\n')}

Enter proposal ID:`;
  }

  switch (input) {
    case '1':
      session.data.vote = 'YES';
      session.state = MENU_STATES.CONFIRM;
      return handleConfirmVote(session, '');

    case '2':
      session.data.vote = 'NO';
      session.state = MENU_STATES.CONFIRM;
      return handleConfirmVote(session, '');

    case '0':
      session.state = MENU_STATES.PROPOSALS;
      return handleProposalsMenu(session, '');

    default:
      return 'CON Invalid choice. Select:\n1. Yes\n2. No\n0. Back';
  }
}

// Vote confirmation handler
function handleConfirmVote(session, input) {
  const proposal = activeProposals.find((p) => p.id === session.data.selectedProposal);

  if (input === '') {
    return `CON Confirm your vote:
Proposal: ${proposal.title}
Your vote: ${session.data.vote}

1. Confirm
2. Change vote
0. Cancel`;
  }

  switch (input) {
    case '1':
      // Submit vote
      const voteHash = generateVoteHash(
        session.sessionId,
        session.data.selectedProposal,
        session.data.vote,
        Date.now()
      );

      // Store pending vote
      pendingVotes.set(voteHash, {
        sessionId: session.sessionId,
        phoneNumber: session.phoneNumber,
        proposalId: session.data.selectedProposal,
        vote: session.data.vote,
        timestamp: Date.now(),
        status: 'pending',
      });

      // In production, submit to blockchain here
      console.log(
        `Vote submitted: ${session.phoneNumber} voted ${session.data.vote} on proposal ${session.data.selectedProposal}`
      );

      // Update mock proposal counts
      if (session.data.vote === 'YES') {
        proposal.votesFor++;
      } else {
        proposal.votesAgainst++;
      }

      // Reset session
      session.state = MENU_STATES.MAIN;
      session.data = {};

      return `END Vote confirmed!
Proposal: ${session.data.selectedProposal}
Vote: ${session.data.vote}
Hash: ${voteHash.substring(0, 8)}...

Thank you for participating in HeliosHash DAO governance!`;

    case '2':
      session.state = MENU_STATES.VOTE;
      return handleVoteInput(session, '');

    case '0':
      session.state = MENU_STATES.MAIN;
      session.data = {};
      return handleMainMenu(session, '');

    default:
      return 'CON Invalid choice.\n1. Confirm\n2. Change\n0. Cancel';
  }
}

// Registration handler
function handleRegistration(session, input) {
  if (input === '') {
    return `CON HeliosHash DAO Registration
To participate you need:
1. Indian mobile number
2. Aadhaar verification  
3. NFT membership tier

Current step: Phone verification
Enter 1 to continue or 0 for main menu`;
  }

  switch (input) {
    case '1':
      session.data.registrationStep = 'phone';
      return `CON Phone Verification
Your number: ${session.phoneNumber}

1. Confirm this number
2. Use different number
0. Cancel registration`;

    case '2':
      if (session.data.registrationStep === 'phone') {
        session.data.registrationStep = 'aadhaar';
        return `CON Aadhaar Verification
Visit urgam.community/verify
OR
SMS "VERIFY [AADHAAR]" to 4567

1. I have completed verification
0. Back to phone verification`;
      }
      return handleRegistration(session, '');

    case '0':
      session.state = MENU_STATES.MAIN;
      session.data = {};
      return handleMainMenu(session, '');

    default:
      return 'CON Invalid choice. Enter 1 to continue or 0 to cancel.';
  }
}

// Status check handler
function handleStatusCheck(session, input) {
  const userVotes = Array.from(pendingVotes.values())
    .filter((vote) => vote.phoneNumber === session.phoneNumber)
    .slice(-3);

  if (userVotes.length === 0) {
    return `END No voting history found.

To participate:
1. Register at urgam.community
2. Complete KYC verification
3. Purchase NFT membership

Call *123*4# to start registration`;
  }

  let statusMessage = 'END Your recent votes:\n\n';
  userVotes.forEach((vote, index) => {
    const voteDate = new Date(vote.timestamp).toLocaleDateString('en-IN');
    statusMessage += `${index + 1}. Proposal ${vote.proposalId}: ${vote.vote}\n`;
    statusMessage += `   Status: ${vote.status}\n`;
    statusMessage += `   Date: ${voteDate}\n\n`;
  });

  statusMessage += `Total votes cast: ${userVotes.length}\n`;
  statusMessage += 'Call *123*2# to vote on active proposals';

  return statusMessage;
}

// SMS endpoint for direct voting
app.post('/sms/vote', async (req, res) => {
  try {
    const { from, text } = req.body;

    // Parse SMS: "VOTE 1 YES" or "REGISTER John Doe"
    const parts = text.toUpperCase().split(' ');
    const command = parts[0];

    if (command === 'VOTE' && parts.length >= 3) {
      const proposalId = parseInt(parts[1]);
      const vote = parts[2];

      if (!['YES', 'NO'].includes(vote)) {
        return res.send('Invalid vote. Use: VOTE [ID] YES or VOTE [ID] NO');
      }

      const proposal = activeProposals.find((p) => p.id === proposalId);
      if (!proposal) {
        return res.send('Invalid proposal ID.');
      }

      // Generate vote hash and store
      const voteHash = generateVoteHash(from, proposalId, vote, Date.now());
      pendingVotes.set(voteHash, {
        phoneNumber: from,
        proposalId: proposalId,
        vote: vote,
        timestamp: Date.now(),
        status: 'confirmed',
      });

      // Update proposal counts
      if (vote === 'YES') {
        proposal.votesFor++;
      } else {
        proposal.votesAgainst++;
      }

      res.send(
        `Vote confirmed! Proposal ${proposalId}: ${vote}. Hash: ${voteHash.substring(0, 8)}...`
      );
    } else if (command === 'HELP') {
      res.send(`HeliosHash DAO SMS Commands:
VOTE [ID] YES/NO - Vote on proposal
REGISTER [NAME] - Start registration
PROPOSALS - List active proposals
STATUS - Check your votes
Call *123# for full menu`);
    } else {
      res.send('Invalid command. Text HELP for instructions.');
    }
  } catch (error) {
    console.error('SMS Error:', error);
    res.send('Service error. Please try again.');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    activeSessions: activeSessions.size,
    pendingVotes: pendingVotes.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Clean up old sessions
function cleanOldSessions() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [sessionId, session] of activeSessions) {
    if (session.timestamp < oneHourAgo) {
      activeSessions.delete(sessionId);
    }
  }
}

setInterval(cleanOldSessions, 10 * 60 * 1000);

// Start server
app.listen(port, () => {
  console.log(`🔗 HHDAO USSD/SMS Server running on port ${port}`);
  console.log(`📱 USSD Endpoint: POST /ussd/vote`);
  console.log(`💬 SMS Endpoint: POST /sms/vote`);
  console.log(`⛓️ Blockchain: ${wallet ? 'Connected' : 'Not configured'}`);
});

module.exports = app;
