import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting Blue Reef Registry deployment to Moonbase Alpha testnet...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "DEV");

  if (balance < ethers.parseEther("0.5")) {
    console.log("⚠️  WARNING: Low balance! You may need more DEV tokens from the faucet.");
    console.log("   Get testnet tokens at: https://faucet.moonbeam.network");
  }

  // Deploy Carbon Credit Token first
  console.log("\n📄 Deploying CarbonCreditToken...");
  const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
  const carbonToken = await CarbonCreditToken.deploy(deployer.address);
  await carbonToken.waitForDeployment();
  const carbonTokenAddress = await carbonToken.getAddress();
  console.log("✅ CarbonCreditToken deployed to:", carbonTokenAddress);

  // Deploy Registry Contract
  console.log("\n📄 Deploying BlueReefRegistry...");
  const BlueReefRegistry = await ethers.getContractFactory("BlueReefRegistry");
  const registry = await BlueReefRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ BlueReefRegistry deployed to:", registryAddress);

  console.log("\n⏳ Contracts deployed successfully!");

  // Verify deployment
  console.log("\n🔍 Verifying deployments...");
  
  try {
    const tokenName = await carbonToken.name();
    const tokenSymbol = await carbonToken.symbol();
    console.log(`✅ Token verified: ${tokenName} (${tokenSymbol})`);
  } catch (error) {
    console.log("❌ Token verification failed:", error);
  }

  try {
    const totalApps = await registry.getTotalApplications();
    console.log(`✅ Registry verified: ${totalApps} applications`);
  } catch (error) {
    console.log("❌ Registry verification failed:", error);
  }

  // Save deployment addresses
  const deploymentInfo = {
    network: "moonbase",
    chainId: 1287,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      CarbonCreditToken: {
        address: carbonTokenAddress,
        transactionHash: carbonToken.deploymentTransaction()?.hash || "N/A"
      },
      BlueReefRegistry: {
        address: registryAddress,
        transactionHash: registry.deploymentTransaction()?.hash || "N/A"
      }
    },
    gasUsed: {
      CarbonCreditToken: "Deployed successfully",
      BlueReefRegistry: "Deployed successfully"
    }
  };

  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `moonbase-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("📁 Deployment info saved to:", deploymentFile);

  // Create environment file for frontend
  const envContent = `# Generated deployment addresses - ${new Date().toISOString()}
VITE_REGISTRY_CONTRACT_ADDRESS=${registryAddress}
VITE_CARBON_TOKEN_ADDRESS=${carbonTokenAddress}
VITE_CHAIN_ID=1287
VITE_NETWORK_NAME=moonbase
VITE_RPC_URL=https://rpc.api.moonbase.moonbeam.network
`;

  const frontendEnvFile = path.join(__dirname, "../../.env.local");
  fs.writeFileSync(frontendEnvFile, envContent);
  console.log("📁 Frontend environment file created:", frontendEnvFile);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("   🪙 Carbon Credit Token:", carbonTokenAddress);
  console.log("   📝 Blue Reef Registry:", registryAddress);
  
  console.log("\n🔗 Moonscan Links:");
  console.log(`   🪙 Token: https://moonbase.moonscan.io/address/${carbonTokenAddress}`);
  console.log(`   📝 Registry: https://moonbase.moonscan.io/address/${registryAddress}`);

  console.log("\n📝 Next Steps:");
  console.log("   1. Verify contracts on Moonscan (optional)");
  console.log("   2. Update frontend configuration");
  console.log("   3. Test contract interactions");
  console.log("   4. Set up backend mock services");

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  
  try {
    // Test registry registration
    console.log("   Testing user registration...");
    const tx1 = await registry.registerUser(0, "Test NGO"); // 0 = NGO
    await tx1.wait();
    console.log("   ✅ User registration successful");

    // Test token authorization
    console.log("   Testing token authorization...");
    const tx2 = await carbonToken.grantMinterRole(deployer.address);
    await tx2.wait();
    console.log("   ✅ Minter role granted");

    console.log("   🎉 All tests passed!");
  } catch (error) {
    console.log("   ❌ Test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
