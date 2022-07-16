# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

#Solhint
Lining
it is tool help as to anaylsis the code for potential errors

yarn add solhint
yarn solhint init
yarn solhint folderpath/\*.sol

# hardhat-deploy

it is a tool which help as wo manage the file of deployment more easily and effectily

```
add required contract
yarn add @chainlink/contracts
yarn add hardhat-deploy
```

https://github.com/wighawag/hardhat-deploy

Since hardhat-deploy-ethers is a fork of @nomiclabs/hardhat-ethers and that other plugin might have an hardcoded dependency on @nomiclabs/hardhat-ethers the best way to install hardhat-deploy-ethers and ensure compatibility is the following:

```
yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```

#Mocking

to test our contract local we need to data from chainlink api to do that we will add mock object which simulates the behaviour of that object

to do this we will deploy that contract local and get the address and pass that address to the api

#Deploy only specific contract
yarn hardhat deploy --tags mocks

#Comment and Document
To create the used Doxygen to comment style and solc to generate document
solc --userdoc --devdock file name.sol

# testing

hardhat coverage is tell which line of code is tested on which are remaining

## Unit

it is way to test each function one by on

Run on
. local hardhat
. fored network

run specific test
yarn hardhat test --grep "key word"

## Staging

it final full test before going to main net

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

#Gas on value storage or Query

when every we do any operation on contrat it will cose as some gas in below link you can find how much each action cost
https://github.com/crytic/evm-opcodes

# Run script

it will help as to fund contract quckily
