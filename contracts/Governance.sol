// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "./HeliosToken.sol";

contract Governance is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {

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
        uint256 proposalId = super.propose(targets, values, calldatas, description);
        proposalTypes[proposalId] = proposalType;

        emit EnergyProposalCreated(proposalId, proposalType, 0);
        return proposalId;
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(Governor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
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

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

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
