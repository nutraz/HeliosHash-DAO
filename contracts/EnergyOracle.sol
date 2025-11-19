import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
    // Chainlink feeds per sourceId
    mapping(string => address) public chainlinkFeeds;
    event ChainlinkFeedSet(string sourceId, address feed);
    event DisputeResolved(uint256 disputeId, string sourceId, bool valid, address[] penalizedOracles);
    event OracleSlashed(address oracle, int256 newReputation);
    /**
     * @dev Set Chainlink feed for a sourceId (governance only)
     */
    function setChainlinkFeed(string memory sourceId, address feed) external onlyRole(GOVERNANCE_ROLE) {
        require(feed != address(0), "Invalid feed");
        chainlinkFeeds[sourceId] = feed;
        emit ChainlinkFeedSet(sourceId, feed);
    }

    /**
     * @dev Get Chainlink median for a sourceId (if set)
     */
    function getChainlinkMedian(string memory sourceId) public view returns (uint256 energy, uint256 carbon, bool ok) {
        address feed = chainlinkFeeds[sourceId];
        if (feed == address(0)) return (0, 0, false);
        AggregatorV3Interface aggregator = AggregatorV3Interface(feed);
        (, int256 answer,,,) = aggregator.latestRoundData();
        if (answer <= 0) return (0, 0, false);
        // For demo: treat answer as energy, carbon = 0
        return (uint256(answer), 0, true);
    }
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
contract EnergyOracle is AccessControl {

    // Multi-oracle aggregation
    uint256 public constant MIN_ORACLE_REPORTS = 3;
    uint256 public constant MAX_ORACLE_REPORTS = 5;
    uint256 public constant MIN_ENERGY = 1;
    uint256 public constant MAX_ENERGY = 1_000_000_000;
    uint256 public constant MIN_CARBON = 0;
    uint256 public constant MAX_CARBON = 1_000_000_000;

    struct OracleReport {
        address oracle;
        uint256 energyAmount;
        uint256 carbonOffset;
        uint256 timestamp;
    }
    // sourceId => array of reports
    mapping(string => OracleReport[]) public pendingReports;
    // sourceId => mapping(oracle => bool)
    mapping(string => mapping(address => bool)) public hasReported;
    // Disputes
    struct Dispute {
        string sourceId;
        address disputer;
        uint256 timestamp;
        string reason;
        bool resolved;
    }
    Dispute[] public disputes;
    // Oracle reputation
    mapping(address => int256) public oracleReputation;

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
    /// Multi-oracle reporting: each oracle submits a report, consensus is reached when MIN_ORACLE_REPORTS are received
    function reportEnergyData(
        string memory sourceId,
        uint256 energyAmount,
        uint256 carbonOffset
    ) external onlyRole(ORACLE_ROLE) {
        require(energyAmount >= MIN_ENERGY && energyAmount <= MAX_ENERGY, "Energy out of bounds");
        require(carbonOffset >= MIN_CARBON && carbonOffset <= MAX_CARBON, "Carbon out of bounds");
        require(!hasReported[sourceId][msg.sender], "Oracle already reported");

        pendingReports[sourceId].push(OracleReport({
            oracle: msg.sender,
            energyAmount: energyAmount,
            carbonOffset: carbonOffset,
            timestamp: block.timestamp
        }));
        hasReported[sourceId][msg.sender] = true;

        // If enough reports, aggregate and finalize
        if (pendingReports[sourceId].length >= MIN_ORACLE_REPORTS) {
            uint256[] memory energies = new uint256[](pendingReports[sourceId].length);
            uint256[] memory carbons = new uint256[](pendingReports[sourceId].length);
            for (uint256 i = 0; i < pendingReports[sourceId].length; i++) {
                energies[i] = pendingReports[sourceId][i].energyAmount;
                carbons[i] = pendingReports[sourceId][i].carbonOffset;
            }
            uint256 medianEnergy = _median(energies);
            uint256 medianCarbon = _median(carbons);
            // Chainlink fallback/sanity check
            (uint256 chainlinkEnergy,, bool ok) = getChainlinkMedian(sourceId);
            if (ok) {
                require(_withinBounds(medianEnergy, chainlinkEnergy, chainlinkEnergy / 10), "Median deviates from Chainlink");
            }
            // Finalize record
            energyRecords[sourceId] = EnergyData({
                timestamp: block.timestamp,
                energyAmount: medianEnergy,
                carbonOffset: medianCarbon,
                sourceId: sourceId,
                verified: false
            });
            totalEnergyReported += medianEnergy;
            totalCarbonOffset += medianCarbon;
            // Update oracle reputation (reward close to median, penalize outliers)
            for (uint256 i = 0; i < pendingReports[sourceId].length; i++) {
                int256 diff = int256(_absDiff(pendingReports[sourceId][i].energyAmount, medianEnergy));
                if (diff <= medianEnergy / 20) { // within 5%
                    oracleReputation[pendingReports[sourceId][i].oracle] += 1;
                } else {
                    oracleReputation[pendingReports[sourceId][i].oracle] -= 2;
                }
            }
            emit EnergyDataReported(sourceId, medianEnergy, medianCarbon, address(0));
            // Clear reports
            delete pendingReports[sourceId];
            // Reset hasReported
            for (uint256 i = 0; i < pendingReports[sourceId].length; i++) {
                hasReported[sourceId][pendingReports[sourceId][i].oracle] = false;
            }
        }
    function _withinBounds(uint256 value, uint256 ref, uint256 tolerance) internal pure returns (bool) {
        if (ref == 0) return true;
        return value >= ref - tolerance && value <= ref + tolerance;
    }

    /**
     * @dev Governance can resolve a dispute, update/correct a record, and penalize oracles
     */
    function resolveDispute(uint256 disputeId, bool valid, uint256 correctEnergy, uint256 correctCarbon, address[] calldata penalizeOracles) external onlyRole(GOVERNANCE_ROLE) {
        require(disputeId < disputes.length, "Invalid dispute");
        require(!disputes[disputeId].resolved, "Already resolved");
        string memory sourceId = disputes[disputeId].sourceId;
        if (valid) {
            energyRecords[sourceId].energyAmount = correctEnergy;
            energyRecords[sourceId].carbonOffset = correctCarbon;
        }
        disputes[disputeId].resolved = true;
        // Penalize oracles
        for (uint256 i = 0; i < penalizeOracles.length; i++) {
            oracleReputation[penalizeOracles[i]] -= 10;
            emit OracleSlashed(penalizeOracles[i], oracleReputation[penalizeOracles[i]]);
        }
        emit DisputeResolved(disputeId, sourceId, valid, penalizeOracles);
    }

    /**
     * @dev Governance can remove ORACLE_ROLE from malicious oracles
     */
    function slashOracle(address oracle) external onlyRole(GOVERNANCE_ROLE) {
        _revokeRole(ORACLE_ROLE, oracle);
        oracleReputation[oracle] = -1000;
        emit OracleSlashed(oracle, oracleReputation[oracle]);
    }
    }

    /// Dispute mechanism: anyone can dispute a record
    function disputeEnergyData(string memory sourceId, string memory reason) external {
        disputes.push(Dispute({
            sourceId: sourceId,
            disputer: msg.sender,
            timestamp: block.timestamp,
            reason: reason,
            resolved: false
        }));
    }

    /// Median calculation (insecure, for demo only)
    function _median(uint256[] memory arr) internal pure returns (uint256) {
        for (uint256 i = 0; i < arr.length; i++) {
            for (uint256 j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[i]) {
                    (arr[i], arr[j]) = (arr[j], arr[i]);
                }
            }
        }
        return arr[arr.length / 2];
    }
    function _absDiff(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a - b : b - a;
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
