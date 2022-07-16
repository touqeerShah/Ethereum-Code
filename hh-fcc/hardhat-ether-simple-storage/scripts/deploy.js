// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const SimpleStorageFactory = await hre.ethers.getContractFactory(
    "SimpleStorage"
  );
  const simpleStorage = await SimpleStorageFactory.deploy();

  await simpleStorage.deployed();

  console.log("Simple Storage deployed to:", simpleStorage.address);
  if (hre.network.config.chainId === 4 && process.env.ETHERSCANAPIKEY) {
    console.log("Waiting for block confirmations...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }
  var currentFavoriteNumber = await simpleStorage.retrieve();
  console.log("currentFavoriteNumber", currentFavoriteNumber.toString());
  var transactionResponse = await simpleStorage.store("32");
  console.log("transactionResponse", transactionResponse);
  await transactionResponse.wait(1);
  var updatedFavoriteNumber = await simpleStorage.retrieve();
  console.log("updatedFavoriteNumber", updatedFavoriteNumber.toString());
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log(e);
    }
  }
};
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
