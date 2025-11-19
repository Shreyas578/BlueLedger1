import { ethers } from "hardhat";

async function main() {
  console.log("🏠 Starting Moonbase Alpha deployment for testing...");
  
  const [deployer, ngo, government, user] = await ethers.getSigners();
  console.log("📝 Deploying with accounts:");
  console.log("   Deployer:", deployer.address);
  console.log("   NGO:", ngo.address);
  console.log("   Government:", government.address);
  console.log("   User:", user.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "DEV");

  if (balance < ethers.parseEther("1")) {
    console.log("⚠️  WARNING: Low balance! Get DEV tokens from: https://faucet.moonbeam.network");
  }

  // Deploy contracts
  console.log("\n📄 Deploying CarbonCreditToken...");
  const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
  const carbonToken = await CarbonCreditToken.deploy(government.address);
  await carbonToken.waitForDeployment();
  const carbonTokenAddress = await carbonToken.getAddress();
  console.log("✅ CarbonCreditToken deployed to:", carbonTokenAddress);

  console.log("\n📄 Deploying BlueReefRegistry...");
  const BlueReefRegistry = await ethers.getContractFactory("BlueReefRegistry");
  const registry = await BlueReefRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ BlueReefRegistry deployed to:", registryAddress);

  console.log("\n✅ Contracts deployed:");
  console.log("   Token:", carbonTokenAddress);
  console.log("   Registry:", registryAddress);

  // Setup test data
  console.log("\n🧪 Setting up test data...");
  
  // Register users
  console.log("   Registering NGO...");
  const tx1 = await registry.connect(ngo).registerUser(0, "Green Earth NGO"); // NGO
  await tx1.wait();
  
  console.log("   Registering Panchayat...");
  const tx2 = await registry.connect(user).registerUser(1, "Village Panchayat"); // Panchayat
  await tx2.wait();
  
  // Submit test application
  console.log("   Submitting test application...");
  const tx3 = await registry.connect(ngo).submitApplication(
    "Green Earth NGO",
    "QmTestDocumentHash123",
    '{"type":"Polygon","coordinates":[[[77.5946,12.9716],[77.5947,12.9716],[77.5947,12.9717],[77.5946,12.9717],[77.5946,12.9716]]]}',
    100, // 100 hectares
    "Mangrove"
  );
  await tx3.wait();
  
  // Approve application
  console.log("   Approving application...");
  const tx4 = await registry.connect(government).updateApplicationStatus(1, 2, "Application approved for testing"); // 2 = Approved
  await tx4.wait();
  
  // Deploy a test project contract
  console.log("\n📄 Deploying ProjectContract...");
  const ProjectContract = await ethers.getContractFactory("ProjectContract");
  const project = await ProjectContract.deploy(
    1, // application ID
    "Test Mangrove Project",
    '{"type":"Polygon","coordinates":[[[77.5946,12.9716],[77.5947,12.9716],[77.5947,12.9717],[77.5946,12.9717],[77.5946,12.9716]]]}',
    100,
    "Mangrove",
    ngo.address,
    government.address,
    1000 // target credits
  );
  await project.waitForDeployment();
  const projectAddress = await project.getAddress();
  console.log("✅ ProjectContract deployed to:", projectAddress);
  
  // Link project to application
  console.log("   Linking project to application...");
  const tx5 = await registry.connect(government).setProjectContract(1, projectAddress);
  await tx5.wait();
  
  // Authorize project to mint tokens
  console.log("   Authorizing project to mint tokens...");
  const tx6 = await carbonToken.connect(government).authorizeProject(projectAddress);
  await tx6.wait();
  
  // Add test NDVI reading
  console.log("   Adding NDVI reading...");
  const tx7 = await project.connect(government).addNDVIReading(
    7500, // 0.75 NDVI
    8500, // 85% coverage
    "QmTestSatelliteImage123"
  );
  await tx7.wait();
  
  // Mint some test credits
  console.log("   Minting test credits...");
  const tx8 = await carbonToken.connect(government).mintCredits(
    projectAddress,
    ngo.address,
    500, // 500 credits
    "Test Mangrove Project",
    '{"type":"Polygon","coordinates":[[[77.5946,12.9716],[77.5947,12.9716],[77.5947,12.9717],[77.5946,12.9717],[77.5946,12.9716]]]}',
    1 // NDVI reading ID
  );
  await tx8.wait();
  
  console.log("✅ Test data setup complete!");
  
  console.log("\n📊 Test Results:");
  const totalApps = await registry.getTotalApplications();
  const ngoBalance = await carbonToken.balanceOf(ngo.address);
  const totalReadings = await project.getTotalNDVIReadings();
  
  console.log("   Applications:", totalApps.toString());
  console.log("   NGO Credits:", ethers.formatEther(ngoBalance));
  console.log("   Project Readings:", totalReadings.toString());
  
  console.log("\n🎯 Moonbase Alpha testing environment ready!");
  console.log("\n📋 Contract Addresses:");
  console.log("   Registry:", registryAddress);
  console.log("   Token:", carbonTokenAddress);
  console.log("   Project:", projectAddress);
  
  console.log("\n🔗 Moonscan Links:");
  console.log(`   Registry: https://moonbase.moonscan.io/address/${registryAddress}`);
  console.log(`   Token: https://moonbase.moonscan.io/address/${carbonTokenAddress}`);
  console.log(`   Project: https://moonbase.moonscan.io/address/${projectAddress}`);

  console.log("\n📝 Test Accounts:");
  console.log(`   NGO: ${ngo.address}`);
  console.log(`   Government: ${government.address}`);
  console.log(`   User: ${user.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
