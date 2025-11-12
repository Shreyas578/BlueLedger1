import { ethers } from "hardhat";

async function main() {
  console.log("🏠 Starting local deployment for testing...");
  
  const [deployer, ngo, government, user] = await ethers.getSigners();
  console.log("📝 Deploying with accounts:");
  console.log("   Deployer:", deployer.address);
  console.log("   NGO:", ngo.address);
  console.log("   Government:", government.address);
  console.log("   User:", user.address);

  // Deploy contracts
  const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");
  const carbonToken = await CarbonCreditToken.deploy(government.address);
  await carbonToken.deployed();

  const BlueReefRegistry = await ethers.getContractFactory("BlueReefRegistry");
  const registry = await BlueReefRegistry.deploy();
  await registry.deployed();

  console.log("\n✅ Contracts deployed:");
  console.log("   Token:", carbonToken.address);
  console.log("   Registry:", registry.address);

  // Setup test data
  console.log("\n🧪 Setting up test data...");

  // Register users
  await registry.connect(ngo).registerUser(0, "Green Earth NGO"); // NGO
  await registry.connect(user).registerUser(1, "Village Panchayat"); // Panchayat
  
  // Submit test application
  await registry.connect(ngo).submitApplication(
    "Green Earth NGO",
    "QmTestDocumentHash123",
    '{"type":"Polygon","coordinates":[[[77.5946,12.9716],[77.5947,12.9716],[77.5947,12.9717],[77.5946,12.9717],[77.5946,12.9716]]]}',
    100, // 100 hectares
    "Mangrove"
  );

  // Approve application
  await registry.connect(government).updateApplicationStatus(1, 2, "Application approved for testing"); // 2 = Approved

  // Deploy a test project contract
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
  await project.deployed();

  // Link project to application
  await registry.connect(government).setProjectContract(1, project.address);

  // Authorize project to mint tokens
  await carbonToken.connect(government).authorizeProject(project.address);

  // Add test NDVI reading
  await project.connect(government).addNDVIReading(
    7500, // 0.75 NDVI
    8500, // 85% coverage
    "QmTestSatelliteImage123"
  );

  // Mint some test credits
  await carbonToken.connect(government).mintCredits(
    project.address,
    ngo.address,
    500, // 500 credits
    "Test Mangrove Project",
    '{"type":"Polygon","coordinates":[[[77.5946,12.9716],[77.5947,12.9716],[77.5947,12.9717],[77.5946,12.9717],[77.5946,12.9716]]]}',
    1 // NDVI reading ID
  );

  console.log("✅ Test data setup complete!");
  console.log("\n📊 Test Results:");
  console.log("   Applications:", await registry.getTotalApplications());
  console.log("   NGO Credits:", ethers.utils.formatEther(await carbonToken.balanceOf(ngo.address)));
  console.log("   Project Readings:", await project.getTotalNDVIReadings());

  console.log("\n🎯 Local testing environment ready!");
  console.log("   Registry:", registry.address);
  console.log("   Token:", carbonToken.address);
  console.log("   Project:", project.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });