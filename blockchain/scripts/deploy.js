const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("H2OToken");
  const token = await Token.deploy(); // Deploy contract
  await token.waitForDeployment();    // ✅ Wait for deployment

  console.log("✅ H2OToken deployed to:", await token.getAddress());
}

main().catch((error) => {
  console.error("❌ Error deploying contract:", error);
  process.exitCode = 1;
});
