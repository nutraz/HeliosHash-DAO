// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title HeliosHashDAO Proxy Governance Contract
 * @dev Extended DAO contract with USSD/SMS proxy voting capabilities
 * Enables offline participation through verified proxy votes
 */
contract HeliosHashDAOProxy is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    Ownable,
    ReentrancyGuard
{
    using ECDSA for bytes32;

    struct ProxyVote {
        bytes32 voteHash;          // Unique vote identifier from USSD/SMS
        address voter;             // Verified voter address
        uint256 proposalId;        // Proposal being voted on
        uint8 support;             // 0=Against, 1=For, 2=Abstain
        uint256 weight;            // Voting weight (NFT-based)
        uint256 timestamp;         // Vote timestamp
        bool executed;             // Whether vote has been cast
        string proofMethod;        // "USSD" or "SMS"
    }

    struct ProxyVoter {
        string phoneNumber;        // Encrypted phone number hash
        address walletAddress;     // Associated wallet
        uint256 nftTokenId;        // Membership NFT ID
        bool isVerified;           // KYC verification status
        bool isActive;             // Active voting status
        uint256 registrationTime;  // Registration timestamp
    }

    // Mappings
    mapping(bytes32 => ProxyVote) public proxyVotes;
    mapping(string => ProxyVoter) public proxyVoters; // phoneHash => voter
    mapping(address => string) public voterToPhone;   // reverse lookup
    mapping(uint256 => bytes32[]) public proposalProxyVotes; // proposalId => vote hashes

    // Oracle and verification
    address public verificationOracle;
    mapping(address => bool) public authorizedOracles;
    
    // Events
    event ProxyVoterRegistered(string phoneHash, address indexed voter, uint256 nftTokenId);
    event ProxyVoteSubmitted(bytes32 indexed voteHash, uint256 indexed proposalId, uint8 support);
    event ProxyVoteExecuted(bytes32 indexed voteHash, uint256 indexed proposalId);
    event OracleUpdated(address indexed oracle, bool authorized);

    // Constants
    uint256 public constant PROXY_VOTE_DELAY = 1 hours;  // Delay before proxy votes can be executed
    uint256 public constant MAX_PROXY_VOTES_PER_PROPOSAL = 1000;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        address _verificationOracle
    )
        Governor("HeliosHashDAO")
        GovernorSettings(1, 50400, 0) // 1 block delay, 1 week voting period, 0 proposal threshold
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {
        verificationOracle = _verificationOracle;
        authorizedOracles[_verificationOracle] = true;
    }

    /**
     * @dev Register a new proxy voter with phone verification
     * @param phoneHash Hashed phone number for privacy
     * @param voter Ethereum address of the voter
     * @param nftTokenId Membership NFT token ID for voting weight
     * @param signature Verification signature from oracle
     */
    function registerProxyVoter(
        string calldata phoneHash,
        address voter,
        uint256 nftTokenId,
        bytes calldata signature
    ) external nonReentrant {
        require(voter != address(0), "Invalid voter address");
        require(!proxyVoters[phoneHash].isActive, "Phone already registered");
        require(voterToPhone[voter] == "", "Address already registered");

        // Verify oracle signature
        bytes32 message = keccak256(abi.encodePacked(phoneHash, voter, nftTokenId));
        address signer = message.toEthSignedMessageHash().recover(signature);
        require(authorizedOracles[signer], "Invalid verification signature");

        // Register proxy voter
        proxyVoters[phoneHash] = ProxyVoter({
            phoneNumber: phoneHash,
            walletAddress: voter,
            nftTokenId: nftTokenId,
            isVerified: true,
            isActive: true,
            registrationTime: block.timestamp
        });

        voterToPhone[voter] = phoneHash;

        emit ProxyVoterRegistered(phoneHash, voter, nftTokenId);
    }

    /**
     * @dev Submit a proxy vote from USSD/SMS
     * @param voteHash Unique identifier for the vote
     * @param phoneHash Voter's phone hash
     * @param proposalId The proposal to vote on
     * @param support Vote choice (0=Against, 1=For, 2=Abstain)
     * @param proofMethod "USSD" or "SMS"
     * @param signature Oracle verification signature
     */
    function submitProxyVote(
        bytes32 voteHash,
        string calldata phoneHash,
        uint256 proposalId,
        uint8 support,
        string calldata proofMethod,
        bytes calldata signature
    ) external nonReentrant {
        require(support <= 2, "Invalid vote type");
        require(proxyVotes[voteHash].voteHash == bytes32(0), "Vote already exists");
        require(proposalProxyVotes[proposalId].length < MAX_PROXY_VOTES_PER_PROPOSAL, "Too many proxy votes");

        ProxyVoter memory voter = proxyVoters[phoneHash];
        require(voter.isActive && voter.isVerified, "Voter not authorized");

        // Verify proposal is active
        require(state(proposalId) == ProposalState.Active, "Proposal not active");

        // Verify oracle signature
        bytes32 message = keccak256(abi.encodePacked(voteHash, phoneHash, proposalId, support));
        address signer = message.toEthSignedMessageHash().recover(signature);
        require(authorizedOracles[signer], "Invalid verification signature");

        // Calculate voting weight based on NFT tier
        uint256 weight = getVotingWeight(voter.nftTokenId);

        // Store proxy vote
        proxyVotes[voteHash] = ProxyVote({
            voteHash: voteHash,
            voter: voter.walletAddress,
            proposalId: proposalId,
            support: support,
            weight: weight,
            timestamp: block.timestamp,
            executed: false,
            proofMethod: proofMethod
        });

        proposalProxyVotes[proposalId].push(voteHash);

        emit ProxyVoteSubmitted(voteHash, proposalId, support);
    }

    /**
     * @dev Execute a batch of proxy votes for a proposal
     * @param proposalId The proposal ID
     * @param voteHashes Array of vote hashes to execute
     */
    function executeProxyVotes(
        uint256 proposalId,
        bytes32[] calldata voteHashes
    ) external nonReentrant {
        require(state(proposalId) == ProposalState.Active, "Proposal not active");

        for (uint256 i = 0; i < voteHashes.length; i++) {
            ProxyVote storage vote = proxyVotes[voteHashes[i]];
            
            require(vote.voteHash != bytes32(0), "Vote does not exist");
            require(!vote.executed, "Vote already executed");
            require(vote.proposalId == proposalId, "Proposal ID mismatch");
            require(
                block.timestamp >= vote.timestamp + PROXY_VOTE_DELAY,
                "Proxy vote delay not met"
            );

            // Execute the vote
            _castVote(proposalId, vote.voter, vote.support, "", vote.weight);
            vote.executed = true;

            emit ProxyVoteExecuted(vote.voteHash, proposalId);
        }
    }

    /**
     * @dev Get voting weight based on NFT membership tier
     * @param nftTokenId The NFT token ID
     * @return weight The voting weight
     */
    function getVotingWeight(uint256 nftTokenId) public pure returns (uint256 weight) {
        // NFT tiers: 1-1000 = Basic (1 vote), 1001-2000 = Premium (3 votes), 2001+ = Steward (10 votes)
        if (nftTokenId <= 1000) {
            return 1;
        } else if (nftTokenId <= 2000) {
            return 3;
        } else {
            return 10;
        }
    }

    /**
     * @dev Get proxy votes for a proposal
     * @param proposalId The proposal ID
     * @return voteHashes Array of vote hashes for the proposal
     */
    function getProposalProxyVotes(uint256 proposalId) external view returns (bytes32[] memory) {
        return proposalProxyVotes[proposalId];
    }

    /**
     * @dev Check if a phone number is registered
     * @param phoneHash The hashed phone number
     * @return isRegistered Whether the phone is registered
     */
    function isPhoneRegistered(string calldata phoneHash) external view returns (bool) {
        return proxyVoters[phoneHash].isActive;
    }

    /**
     * @dev Update oracle authorization
     * @param oracle Oracle address
     * @param authorized Authorization status
     */
    function setOracleAuthorization(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
        emit OracleUpdated(oracle, authorized);
    }

    /**
     * @dev Deactivate a proxy voter (emergency function)
     * @param phoneHash The phone hash to deactivate
     */
    function deactivateProxyVoter(string calldata phoneHash) external onlyOwner {
        proxyVoters[phoneHash].isActive = false;
    }

    // Override required functions
    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}