// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HeliosToken is ERC20, ERC20Votes, ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens

    // Energy reward tracking
    mapping(address => uint256) public energyContributions;
    uint256 public totalEnergyRecorded;

    event EnergyRewardMinted(address indexed to, uint256 energyAmount, uint256 tokenAmount);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(address initialOwner)
        ERC20("HeliosToken", "HT")
        ERC20Permit("HeliosToken")
        Ownable(initialOwner)
    {
        // Mint initial supply to deployer (governance will control this)
        _mint(msg.sender, 20_000_000 * 10**18); // 20% initial supply
    }

    /**
     * @dev Mint tokens for energy contributions (callable only by EnergyOracle)
     */
    function mintForEnergy(address to, uint256 energyAmount) external onlyOwner {
        require(totalSupply() + energyAmount <= MAX_SUPPLY, "Exceeds max supply");

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
