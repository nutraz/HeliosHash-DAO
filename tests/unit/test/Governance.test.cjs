const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Contract", function () {
  let governance;
  let heliosToken;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy HeliosToken first
    const HeliosToken = await ethers.getContractFactory("HeliosToken");
    heliosToken = await HeliosToken.deploy(owner.address);
    await heliosToken.waitForDeployment();

    // Transfer tokens to owner for testing (since mint is onlyOwner)
    await heliosToken.transfer(owner.address, ethers.parseEther("1000000")); // 1M tokens

    // Deploy Governance
    const Governance = await ethers.getContractFactory("Governance");
    governance = await Governance.deploy(await heliosToken.getAddress());
    await governance.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct token address", async function () {
      expect(await governance.token()).to.equal(await heliosToken.getAddress());
    });
  });

  describe("Proposal Creation", function () {
    it("Should create a proposal", async function () {
      // Delegate voting power to self first
      await heliosToken.connect(owner).delegate(owner.address);

      const targets = [addr1.address];
      const values = [0];
      const calldatas = ["0x"];
      const description = "Test proposal";

      const tx = await governance.connect(owner)["propose(address[],uint256[],bytes[],string,uint8)"](targets, values, calldatas, description, 0); // 0 = GENERAL
      await expect(tx).to.emit(governance, "ProposalCreated");

      const proposalId = await governance.hashProposal(targets, values, calldatas, ethers.keccak256(ethers.toUtf8Bytes(description)));
      const proposalType = await governance.proposalTypes(proposalId);

      expect(proposalType).to.equal(0); // GENERAL
    });
  });

  describe("Voting", function () {
    let proposalId;

    beforeEach(async function () {
      // Delegate voting power to self first
      await heliosToken.connect(owner).delegate(owner.address);

      // Create a proposal
      const targets = [addr1.address];
      const values = [0];
      const calldatas = ["0x"];
      const description = "Test proposal";

      const tx = await governance.connect(owner)["propose(address[],uint256[],bytes[],string,uint8)"](targets, values, calldatas, description, 0); // 0 = GENERAL
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => log.eventName === "ProposalCreated");
      proposalId = event.args[0]; // proposalId is the first argument
    });

    it("Should allow voting on active proposals", async function () {
      // Mine some blocks to pass the voting delay
      await ethers.provider.send("evm_mine");
      await ethers.provider.send("evm_mine");

      await expect(governance.connect(owner).castVote(proposalId, 1))
        .to.emit(governance, "VoteCast");
    });

    it("Should not allow voting on non-existent proposals", async function () {
      const fakeProposalId = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      await expect(governance.connect(owner).castVote(fakeProposalId, 1))
        .to.be.reverted;
    });
  });
});
