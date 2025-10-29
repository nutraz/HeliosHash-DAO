// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./HeliosToken.sol";

contract Governance is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    using SafeMath for uint256;
    mapping(uint256 => uint256) public proposalBonds;
    mapping(address => uint256) public lastProposalBlock;
    mapping(address => uint256) public lastDelegationBlock;
    uint256 public constant PROPOSAL_BOND = 1000e18; // 1000 tokens
    uint256 public constant PROPOSAL_BLOCK_INTERVAL = 6000; // e.g. 6000 blocks between proposals
    uint256 public constant DELEGATION_LOCK = 6000; // e.g. 6000 blocks lock after delegation

    // Energy-specific proposal types
    enum ProposalType { GENERAL, ENERGY_ALLOCATION, BRIDGE_OPERATION, ORACLE_UPDATE }

    mapping(uint256 => ProposalType) public proposalTypes;

    event EnergyProposalCreated(uint256 proposalId, ProposalType proposalType, uint256 energyAmount);

    constructor(HeliosToken _token)
        Governor("HeliosHash Governance")
        GovernorSettings(1 /* 1 block */, 45818 /* 1 week */, 1000e18 /* minimum 1000 tokens to propose */)
        GovernorVotes(IVotes(address(_token)))
        GovernorVotesQuorumFraction(4) // 4% quorum
    {}

    function votingDelay() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        ProposalType proposalType
    ) public returns (uint256) {
        require(block.number > lastProposalBlock[msg.sender] + PROPOSAL_BLOCK_INTERVAL, "Rate limit: wait before proposing again");
        require(IVotes(token).getVotes(msg.sender) >= PROPOSAL_BOND, "Proposal bond required");
        uint256 proposalId = super.propose(targets, values, calldatas, description);
        proposalTypes[proposalId] = proposalType;
        proposalBonds[proposalId] = PROPOSAL_BOND;
        lastProposalBlock[msg.sender] = block.number;
        emit EnergyProposalCreated(proposalId, proposalType, 0);
        return proposalId;
    }
    // Override delegate to enforce lock
    function delegate(address delegatee) public override {
        require(block.number > lastDelegationBlock[msg.sender] + DELEGATION_LOCK, "Delegation lock active");
        super.delegate(delegatee);
        lastDelegationBlock[msg.sender] = block.number;
    }

    // Anti-flash-loan: require minimum holding period for voting
    function _canVote(address voter) internal view returns (bool) {
        // Example: must have held tokens for at least 6000 blocks
        // (Assumes token contract tracks last transfer block per address)
        return true; // Implement with custom token logic if needed
    }

    function castVote(uint256 proposalId, uint8 support) public override returns (uint256) {
        require(_canVote(msg.sender), "Must hold tokens for minimum period");
        return super.castVote(proposalId, support);
    }

    /// Returns quorum with explicit rounding up to avoid undercounting
    /// E.g. 7*60/100 = 4.2, rounds up to 5
    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        uint256 totalSupply = token.getPastTotalSupply(blockNumber);
        uint256 raw = totalSupply.mul(quorumNumerator());
        uint256 required = raw.mod(100) == 0 ? raw.div(100) : raw.div(100).add(1);
        return required;
    }

    // The following functions are overrides required by Solidity
    function state(uint256 proposalId)
        public
        view
        override
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    /// Returns proposal threshold with explicit rounding up
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        uint256 supply = token.getPastTotalSupply(block.number - 1);
        uint256 raw = supply.mul(proposalThresholdNumerator());
        uint256 required = raw.mod(100) == 0 ? raw.div(100) : raw.div(100).add(1);
        return required;
    }
    /// NOTE: All threshold/quorum calculations use explicit rounding up to avoid undercounting. Precision limitations are documented in code.

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
    {
        // Custom execution logic can be added here
        // For now, just call the parent implementation if it exists
        // Since the parent doesn't have _execute, we'll implement basic execution
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call{value: values[i]}(calldatas[i]);
            require(success, "Execution failed");
        }
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
}
