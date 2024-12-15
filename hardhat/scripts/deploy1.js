const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of VulnerableContract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  // Get balance using provider
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH/Native Token\n");

  const VulnerableContract1 = await hre.ethers.getContractFactory("VulnerableContract1");
  console.log("⚠️ WARNING: Deploying a contract with known vulnerabilities. DO NOT USE IN PRODUCTION.");

  let vulnerableContract;
  let deployedAddress;

  try {
    // Deploy the VulnerableContract
    vulnerableContract = await VulnerableContract1.deploy();
    console.log("📄 Deploying VulnerableContract...");

    console.log("⏳ Waiting for deployment...");
    await vulnerableContract.waitForDeployment();

    deployedAddress = await vulnerableContract.getAddress();
    console.log("✅ VulnerableContract deployed to:", deployedAddress);

    // Wait for indexing (network-dependent)
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verification
    console.log("\n🔍 Starting contract verification...");
    try {
      await hre.run("verify:verify", {
        address: deployedAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on block explorer!");
    } catch (verificationError) {
      console.log("❌ Verification error:", verificationError.message);
    }

    // Deployment Summary
    console.log("\n📝 Deployment Summary:");
    console.log("----------------------");
    console.log("Contract Address:", deployedAddress);

    // Network-specific block explorer URLs
    const blockExplorers = {
      'baseSepolia': `https://base-sepolia.blockscout.com/address/${deployedAddress}`,
      'bscTestnet': `https://testnet.bscscan.com/address/${deployedAddress}`,
      'moonbeamTestnet': `https://moonbase.moonscan.io/address/${deployedAddress}`
    };

    console.log("Block Explorer:", blockExplorers[hre.network.name] || 'N/A');
    console.log("Network:", hre.network.name);
    console.log("----------------------\n");

  } catch (deploymentError) {
    console.error("❌ Deployment failed:", deploymentError);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
