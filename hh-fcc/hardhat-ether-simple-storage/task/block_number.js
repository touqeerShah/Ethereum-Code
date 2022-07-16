const { task } = require("hardhat/config");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task(
  "block-number",
  "Prints Number of block at that chain",
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("Current Block Number : ", blockNumber);
  }
);
