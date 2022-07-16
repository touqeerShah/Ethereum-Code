# Basic Sample Hardhat Project

first create folder
init the porject with `yarn init`
then install hardhat module `yarn add --dev hardhat`
once setup thing run `yarn hardhat` to create simple file which help as to used them quick start

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node #it wiil start network on local machine like it is running as ganache
node scripts/sample-script.js
npx hardhat help
```

This command help to find the root of hardhat config file place.

```
npx hardhat --verbose
```

```we can calculate the gas spend on every function call
yarn add hardhat-gas-reporter
add in hardhat config
 gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKETCAP_API_KEY, # login to coin market cap to create account and get API
  },

```

Solidity coverage
it tell which line of code are tested or which line is left

Those are module if you want to run the code with type script
yarn add --dev @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node @types/mocha ts-node typechain typescript

# @typechain/hardhat

this plugin help as to convert the smart contract into type for type script

```
yarh hardhat typechain

```

generating typeing of contract and generate folder for type
