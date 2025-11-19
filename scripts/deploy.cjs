const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying HeliosHash DAO Smart Contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy HeliosToken
  console.log("📝 Deploying HeliosToken...");
  const HeliosToken = await ethers.getContractFactory("HeliosToken");
  const heliosToken = await HeliosToken.deploy(deployer.address);
  await heliosToken.waitForDeployment();
  const tokenAddress = await heliosToken.getAddress();
  console.log("✅ HeliosToken deployed to:", tokenAddress);

  // Deploy EnergyOracle
  console.log("⚡ Deploying EnergyOracle...");
  const EnergyOracle = await ethers.getContractFactory("EnergyOracle");
  const energyOracle = await EnergyOracle.deploy();
  await energyOracle.waitForDeployment();
  const oracleAddress = await energyOracle.getAddress();
  console.log("✅ EnergyOracle deployed to:", oracleAddress);

  // Deploy Governance
  console.log("🏛️ Deploying Governance...");
  const Governance = await ethers.getContractFactory("Governance");
  const governance = await Governance.deploy(tokenAddress);
  await governance.waitForDeployment();
  const governanceAddress = await governance.getAddress();
  console.log("✅ Governance deployed to:", governanceAddress);

  // Deploy Bridge
  console.log("🌉 Deploying Bridge...");
  const Bridge = await ethers.getContractFactory("Bridge");
  const bridge = await Bridge.deploy(tokenAddress);
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log("✅ Bridge deployed to:", bridgeAddress);

  // Deploy TimelockController first (required for HeliosHashDAOProxy)
  console.log("⏰ Deploying TimelockController...");
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelock = await TimelockController.deploy(3600, [], [], deployer.address); // 1 hour delay
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ TimelockController deployed to:", timelockAddress);

  // Deploy HeliosHashDAOProxy
  console.log("🔐 Deploying HeliosHashDAOProxy...");
  const HeliosHashDAOProxy = await ethers.getContractFactory("HeliosHashDAOProxy");
  const proxy = await HeliosHashDAOProxy.deploy(tokenAddress, timelock, oracleAddress, deployer.address);
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log("✅ HeliosHashDAOProxy deployed to:", proxyAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      HeliosToken: tokenAddress,
      EnergyOracle: oracleAddress,
      Governance: governanceAddress,
      Bridge: bridgeAddress,
      HeliosHashDAOProxy: proxyAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log("======================");
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`HeliosToken: ${tokenAddress}`);
  console.log(`EnergyOracle: ${oracleAddress}`);
  console.log(`Governance: ${governanceAddress}`);
  console.log(`Bridge: ${bridgeAddress}`);
  console.log(`HeliosHashDAOProxy: ${proxyAddress}`);

  // Save to file
  const fs = require("fs");
  fs.writeFileSync("deployment.json", JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment.json");

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("Next steps:");
  console.log("1. Verify contracts on Etherscan (if on mainnet)");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Test contract interactions");
  console.log("4. Deploy to additional networks if needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
