/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

var {
    PROVIDER_REN_URL,
    PRIVATE_KEY,
    ETHERSCANAPIKEY,
    PROVIDER_hardhate_URL,
    PRIVATE_KEY_HARDHAT,
    COINMARKETCAP_API_KEY,
} = process.env

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
            allowUnlimitedContractSize: true,
            blockGasLimit: 10000000042972011111, // whatever you want here

            // accounts: [`${PRIVATE_KEY_HARDHAT}`], // it will import default by hardhat
        },
    },
    solidity: {
        version: "0.8.9",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    // solidity: {
    //     compilers: [
    //         {
    //             version: "0.8.9",
    //         },
    //     ],
    //     settings: {
    //         optimizer: {
    //             enabled: true,
    //             runs: 200,
    //         },
    //     },
    //     contractSizer: {
    //         alphaSort: true,
    //         runOnCompile: true,
    //         disambiguatePaths: false,
    //     },
    // },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        redeemer: {
            default: 1,
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
        token: "MATIC",
    },
}
