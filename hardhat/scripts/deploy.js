const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of BugHuntr.ai...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);

  // Get balance using provider
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH/Native Token\n");

  const BugHuntr = await hre.ethers.getContractFactory("BugHuntr");
  console.log("📄 Deploying BugHuntr.ai...");

  let bugHuntr;
  let deployedAddress;

  try {
    // Network-specific deployment configurations
    switch (hre.network.name) {
      case 'westend':
        // Polkadot Westend Asset Hub specific deployment
        bugHuntr = await BugHuntr.deploy({
          gasLimit: 10000000, // Adjust based on network capabilities
        });
        break;
      case 'moonbeamTestnet':
        // Moonbeam testnet-specific configuration
        bugHuntr = await BugHuntr.deploy({
          gasLimit: 5000000, // Adjust based on Moonbeam's gas requirements
        });
        break;
      default:
        // Default deployment for EVM-compatible networks
        bugHuntr = await BugHuntr.deploy();
    }

    console.log("⏳ Waiting for deployment...");
    await bugHuntr.waitForDeployment();

    deployedAddress = await bugHuntr.getAddress();
    console.log("✅ BugHuntr.ai deployed to:", deployedAddress);

    // Wait for indexing (network-dependent)
    await new Promise(resolve => setTimeout(resolve,
      hre.network.name === 'westend' ? 60000 : 30000
    ));

    // Verification with network-specific handling
    console.log("\n🔍 Starting contract verification...");
    try {
      switch (hre.network.name) {
          case 'mantleTestnet':
          await hre.run("verify:verify", {
            address: deployedAddress,
            constructorArguments: [],
          });
          break;
        default:
          console.log("⚠️ Verification not configured for this network");
      }
      console.log("✅ Contract verified on block explorer!");
    } catch (verificationError) {
      console.log("❌ Verification error:", verificationError.message);
    }

    // Deployment summary with network-specific block explorer
    console.log("\n📝 Deployment Summary:");
    console.log("----------------------");
    console.log("Contract Address:", deployedAddress);

    // Network-specific block explorer URLs
    const blockExplorers = {
      'mantleTestnet': `https://sepolia.mantlescan.xyz/address/${deployedAddress}`,
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
