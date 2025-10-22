// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HeliosToken.sol";

contract Bridge is ReentrancyGuard, AccessControl {
    bytes32 public constant BRIDGE_OPERATOR_ROLE = keccak256("BRIDGE_OPERATOR_ROLE");

    HeliosToken public immutable heliosToken;

    // Bridge state
    mapping(bytes32 => bool) public processedTransactions;
    mapping(address => uint256) public lockedTokens;

    uint256 public totalLocked;
    uint256 public bridgeFee = 0.001 ether; // Default bridge fee

    // Events
    event TokensLocked(
        address indexed from,
        uint256 amount,
        uint256 targetChainId,
        address targetRecipient,
        bytes32 transactionId
    );

    event TokensUnlocked(
        address indexed to,
        uint256 amount,
        uint256 sourceChainId,
        bytes32 transactionId
    );

    event BridgeFeeUpdated(uint256 newFee);
    event EmergencyWithdrawal(address token, uint256 amount);

    constructor(HeliosToken _heliosToken) {
        heliosToken = _heliosToken;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BRIDGE_OPERATOR_ROLE, msg.sender);
    }

    /**
     * @dev Lock tokens for bridging to another chain
     */
    function lockTokens(
        uint256 amount,
        uint256 targetChainId,
        address targetRecipient
    ) external payable nonReentrant {
        require(amount > 0, "Amount must be positive");
        require(msg.value >= bridgeFee, "Insufficient bridge fee");

        // Transfer tokens from user to bridge
        require(heliosToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        bytes32 transactionId = keccak256(
            abi.encodePacked(
                msg.sender,
                amount,
                targetChainId,
                targetRecipient,
                block.chainid,
                block.timestamp
            )
        );

        lockedTokens[msg.sender] += amount;
        totalLocked += amount;

        emit TokensLocked(msg.sender, amount, targetChainId, targetRecipient, transactionId);
    }

    /**
     * @dev Unlock tokens from another chain (callable by bridge operator)
     */
    function unlockTokens(
        address recipient,
        uint256 amount,
        uint256 sourceChainId,
        bytes32 transactionId
    ) external onlyRole(BRIDGE_OPERATOR_ROLE) nonReentrant {
        require(!processedTransactions[transactionId], "Transaction already processed");
        require(amount > 0, "Amount must be positive");

        processedTransactions[transactionId] = true;

        // Mint tokens to recipient (assuming this is the home chain)
        heliosToken.mintForEnergy(recipient, amount);

        emit TokensUnlocked(recipient, amount, sourceChainId, transactionId);
    }

    /**
     * @dev Update bridge fee (governance function)
     */
    function setBridgeFee(uint256 newFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        bridgeFee = newFee;
        emit BridgeFeeUpdated(newFee);
    }

    /**
     * @dev Emergency withdrawal of tokens (governance function)
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        IERC20(token).transfer(msg.sender, amount);
        emit EmergencyWithdrawal(token, amount);
    }

    /**
     * @dev Withdraw collected bridge fees
     */
    function withdrawFees() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    /**
     * @dev Check if transaction was processed
     */
    function isTransactionProcessed(bytes32 transactionId) external view returns (bool) {
        return processedTransactions[transactionId];
    }
}
