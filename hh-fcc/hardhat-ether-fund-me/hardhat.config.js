require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-deploy");
require("hardhat-gas-reporter");

var {
  PROVIDER_REN_URL,
  PRIVATE_KEY,
  ETHERSCANAPIKEY,
  PROVIDER_hardhate_URL,
  PRIVATE_KEY_HARDHAT,
  COINMARKETCAP_API_KEY,
} = process.env;

// console.log("PRIVATE_KEY", PRIVATE_KEY);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    rinkeby: {
      url: PROVIDER_REN_URL,
      chainId: 4,
      accounts: [`${PRIVATE_KEY}`],
      blockConfirmations: 6,
    },
    localhost: {
      url: PROVIDER_hardhate_URL,
      chainId: 31337,
      // accounts: [`${PRIVATE_KEY_HARDHAT}`], // it will import default by hardhat
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.4.24",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.7.0",
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    // this is used to verify the contract
    apiKey: ETHERSCANAPIKEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
};
