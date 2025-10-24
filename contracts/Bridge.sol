// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/TimelockController.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./HeliosToken.sol";

contract Bridge is ReentrancyGuard, AccessControl, Pausable {
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

    bytes32 public constant MULTISIG_ROLE = keccak256("MULTISIG_ROLE");

    constructor(HeliosToken _heliosToken, address[] memory _multisigSigners) {
        heliosToken = _heliosToken;
        require(_multisigSigners.length >= 3, "At least 3 multisig signers");
        for (uint256 i = 0; i < _multisigSigners.length; i++) {
            _grantRole(MULTISIG_ROLE, _multisigSigners[i]);
        }
        _grantRole(DEFAULT_ADMIN_ROLE, _multisigSigners[0]);
        _grantRole(BRIDGE_OPERATOR_ROLE, _multisigSigners[0]);
    }

    /**
     * @dev Lock tokens for bridging to another chain
     */
    function lockTokens(
        uint256 amount,
        uint256 targetChainId,
        address targetRecipient
    ) external payable nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be positive");
        require(msg.value >= bridgeFee, "Insufficient bridge fee");

        // State update BEFORE external call
        lockedTokens[msg.sender] += amount;
        totalLocked += amount;

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
    ) external nonReentrant whenNotPaused {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can unlock");
        require(!processedTransactions[transactionId], "Transaction already processed");
        require(amount > 0, "Amount must be positive");

        processedTransactions[transactionId] = true;

        // Mint tokens to recipient (assuming this is the home chain)
        // Use multi-sig mintForEnergy (opHash = transactionId)
        heliosToken.mintForEnergy(recipient, amount, transactionId);

        emit TokensUnlocked(recipient, amount, sourceChainId, transactionId);
    }

    /**
     * @dev Update bridge fee (governance function)
     */
    function setBridgeFee(uint256 newFee) external {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can set fee");
        bridgeFee = newFee;
        emit BridgeFeeUpdated(newFee);
    }

    /**
     * @dev Emergency withdrawal of tokens (governance function)
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
    {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can withdraw");
        IERC20(token).transfer(msg.sender, amount);
        emit EmergencyWithdrawal(token, amount);
    }

    /**
     * @dev Withdraw collected bridge fees
     */
    function withdrawFees() external {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can withdraw fees");
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // Emergency pause/unpause
    function pauseBridge() external {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can pause");
        _pause();
    }
    function unpauseBridge() external {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Only multisig can unpause");
        _unpause();
    }

    /**
     * @dev Check if transaction was processed
     */
    function isTransactionProcessed(bytes32 transactionId) external view returns (bool) {
        return processedTransactions[transactionId];
    }
}
