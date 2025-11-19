const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeliosToken", function () {
  let HeliosToken, heliosToken, owner, addr1, addr2;

  beforeEach(async function () {
    HeliosToken = await ethers.getContractFactory("HeliosToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    heliosToken = await HeliosToken.deploy(owner.address);
    await heliosToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await heliosToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await heliosToken.name()).to.equal("HeliosToken");
      expect(await heliosToken.symbol()).to.equal("HT");
    });

    it("Should have correct initial supply", async function () {
      const totalSupply = await heliosToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("20000000")); // 20M tokens
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await heliosToken.transfer(addr1.address, 50);
      const addr1Balance = await heliosToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      await heliosToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await heliosToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await heliosToken.balanceOf(owner.address);
      await expect(
        heliosToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.reverted;
      expect(await heliosToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await heliosToken.balanceOf(owner.address);

      await heliosToken.transfer(addr1.address, 100);
      await heliosToken.transfer(addr2.address, 50);

      const finalOwnerBalance = await heliosToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await heliosToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await heliosToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });

  describe("Voting", function () {
    it("Should delegate voting power", async function () {
      await heliosToken.transfer(addr1.address, 100);
      await heliosToken.connect(addr1).delegate(addr2.address);

      expect(await heliosToken.getVotes(addr2.address)).to.equal(100);
    });

    it("Should have correct voting power", async function () {
      const ownerBalance = await heliosToken.balanceOf(owner.address);
      // For ERC20Votes, voting power is not automatically delegated
      // We need to delegate to self first
      await heliosToken.connect(owner).delegate(owner.address);
      expect(await heliosToken.getVotes(owner.address)).to.equal(ownerBalance);
    });
  });
});
