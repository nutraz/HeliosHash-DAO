// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
contract EnergyOracle is AccessControl {

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");

    // Energy data structure
    struct EnergyData {
        uint256 timestamp;
        uint256 energyAmount; // kWh or similar unit
        uint256 carbonOffset; // kg CO2 equivalent
        string sourceId; // Renewable source identifier
        bool verified;
    }

    // Storage
    mapping(string => EnergyData) public energyRecords;
    mapping(address => uint256) public userEnergyContributions;

    uint256 public totalEnergyReported;
    uint256 public totalCarbonOffset;

    // Events
    event EnergyDataReported(string sourceId, uint256 energyAmount, uint256 carbonOffset, address reporter);
    event EnergyDataVerified(string sourceId, bool verified);
    event OracleUpdated(string sourceId, uint256 newEnergyAmount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(GOVERNANCE_ROLE, msg.sender);
    }

    /**
     * @dev Report energy data (callable by oracle nodes)
     */
    function reportEnergyData(
        string memory sourceId,
        uint256 energyAmount,
        uint256 carbonOffset,
        address contributor
    ) external onlyRole(ORACLE_ROLE) {
        require(energyAmount > 0, "Energy amount must be positive");

        energyRecords[sourceId] = EnergyData({
            timestamp: block.timestamp,
            energyAmount: energyAmount,
            carbonOffset: carbonOffset,
            sourceId: sourceId,
            verified: false
        });

        userEnergyContributions[contributor] += energyAmount;
        totalEnergyReported += energyAmount;
        totalCarbonOffset += carbonOffset;

        emit EnergyDataReported(sourceId, energyAmount, carbonOffset, contributor);
    }

    /**
     * @dev Verify energy data (callable by governance)
     */
    function verifyEnergyData(string memory sourceId, bool verified)
        external
        onlyRole(GOVERNANCE_ROLE)
    {
        energyRecords[sourceId].verified = verified;
        emit EnergyDataVerified(sourceId, verified);
    }

    /**
     * @dev Update energy data (emergency function for governance)
     */
    function updateEnergyData(
        string memory sourceId,
        uint256 newEnergyAmount,
        uint256 newCarbonOffset
    ) external onlyRole(GOVERNANCE_ROLE) {
        EnergyData storage data = energyRecords[sourceId];
        require(data.timestamp > 0, "Data does not exist");

        // Adjust totals
        totalEnergyReported = totalEnergyReported - data.energyAmount + newEnergyAmount;
        totalCarbonOffset = totalCarbonOffset - data.carbonOffset + newCarbonOffset;

        data.energyAmount = newEnergyAmount;
        data.carbonOffset = newCarbonOffset;
        data.timestamp = block.timestamp;

        emit OracleUpdated(sourceId, newEnergyAmount);
    }

    /**
     * @dev Get user's total verified energy contribution
     */
    function getUserEnergyContribution(address user) external view returns (uint256) {
        return userEnergyContributions[user];
    }

    /**
     * @dev Check if energy source is verified
     */
    function isEnergyVerified(string memory sourceId) external view returns (bool) {
        return energyRecords[sourceId].verified;
    }
}
