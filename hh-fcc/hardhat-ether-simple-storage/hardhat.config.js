require("@nomiclabs/hardhat-waffle");
require("./task/block_number");
require("hardhat-gas-reporter");
require("dotenv").config();
require("solidity-coverage");
var {
  PROVIDER_REN_URL,
  PRIVATE_KEY,
  ETHERSCANAPIKEY,
  PROVIDER_hardhate_URL,
  PRIVATE_KEY_HARDHAT,
  COINMARKETCAP_API_KEY,
} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {},
    rinkeby: {
      url: PROVIDER_REN_URL,
      chainId: 4,
      accounts: [`${PRIVATE_KEY}`],
    },
    localhost: {
      url: PROVIDER_hardhate_URL,
      chainId: 31337,
      // accounts: [`${PRIVATE_KEY_HARDHAT}`], // it will import default by hardhat
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCANAPIKEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
};
