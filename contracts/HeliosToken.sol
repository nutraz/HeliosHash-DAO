// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/TimelockController.sol";

contract HeliosToken is ERC20, ERC20Votes, ERC20Permit, AccessControl {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MULTISIG_ROLE = keccak256("MULTISIG_ROLE");
    bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");

    // Multi-sig state
    address[] public multisigSigners;
    uint256 public multisigThreshold = 3; // 3-of-N
    mapping(bytes32 => address[]) public multisigApprovals; // opHash => signers
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens

    // Energy reward tracking
    mapping(address => uint256) public energyContributions;
    uint256 public totalEnergyRecorded;

    event EnergyRewardMinted(address indexed to, uint256 energyAmount, uint256 tokenAmount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(address[] memory _multisigSigners)
        ERC20("HeliosToken", "HT")
        ERC20Permit("HeliosToken")
    {
        require(_multisigSigners.length >= multisigThreshold, "Not enough multisig signers");
        multisigSigners = _multisigSigners;
        _setupRole(DEFAULT_ADMIN_ROLE, _multisigSigners[0]);
        for (uint256 i = 0; i < _multisigSigners.length; i++) {
            _setupRole(MULTISIG_ROLE, _multisigSigners[i]);
        }
        // Optionally, assign MINTER_ROLE to a timelock contract or governance
        // _setupRole(MINTER_ROLE, timelockAddress);
        _mint(_multisigSigners[0], 20_000_000 * 10**18); // 20% initial supply
    }

    /**
     * @dev Mint tokens for energy contributions (callable only by EnergyOracle)
     */
    // Multi-sig mint: requires 3-of-N signers to approve
    function mintForEnergy(address to, uint256 energyAmount, bytes32 opHash) external {
        require(hasRole(MULTISIG_ROLE, msg.sender), "Not multisig signer");
        require(totalSupply() + energyAmount <= MAX_SUPPLY, "Exceeds max supply");

        // Track approvals
        address[] storage approvals = multisigApprovals[opHash];
        for (uint256 i = 0; i < approvals.length; i++) {
            require(approvals[i] != msg.sender, "Already approved");
        }
        approvals.push(msg.sender);
        if (approvals.length < multisigThreshold) {
            return; // Not enough approvals yet
        }
        // Reset approvals for this opHash
        delete multisigApprovals[opHash];

        // Convert energy to tokens (1 energy unit = 1 token, adjustable)
        uint256 tokenAmount = energyAmount;

        energyContributions[to] += energyAmount;
        totalEnergyRecorded += energyAmount;
        _mint(to, tokenAmount);

        emit EnergyRewardMinted(to, energyAmount, tokenAmount);
    }

    /**
     * @dev Burn tokens (for deflationary mechanism or bridge operations)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // The following functions are overrides required by Solidity
    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, amount);
    }

    function nonces(address owner)
        public
        view
        virtual
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
