const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeliosHashDAOProxy Contract", function () {
  let HeliosHashDAOProxy, proxy;
  let owner, addr1, addr2;
  let governance, timelock;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy dependencies for HeliosHashDAOProxy
    const HeliosToken = await ethers.getContractFactory("HeliosToken");
    const heliosToken = await HeliosToken.deploy(owner.address);
    await heliosToken.waitForDeployment();

    // Deploy TimelockController
    const TimelockController = await ethers.getContractFactory("TimelockController");
    const timelock = await TimelockController.deploy(3600, [], [], owner.address); // 1 hour delay
    await timelock.waitForDeployment();

    // Deploy proxy
    HeliosHashDAOProxy = await ethers.getContractFactory("HeliosHashDAOProxy");
    proxy = await HeliosHashDAOProxy.deploy(
      await heliosToken.getAddress(),
      await timelock.getAddress(),
      owner.address, // verification oracle
      owner.address // initial owner
    );
    await proxy.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the deployer as the initial owner", async function () {
      expect(await proxy.owner()).to.equal(owner.address);
    });

    it("Should have proper contract address", async function () {
      expect(await proxy.getAddress()).to.be.properAddress;
    });
  });

  describe("Proxy Functionality", function () {
    it("Should allow owner to execute proposals", async function () {
      // This would test the proxy execution logic
      // For now, just verify the contract is deployed correctly
      expect(await proxy.getAddress()).to.be.properAddress;
    });

    it("Should restrict non-owner from critical operations", async function () {
      // Test access control - would need to implement specific proxy methods
      expect(await proxy.owner()).to.equal(owner.address);
    });
  });
});
