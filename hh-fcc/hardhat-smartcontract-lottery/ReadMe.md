step 1 create folder
step 2 install hardhat
step 3 create empty project
ster 4 install following dependency

```
// javascript
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv

```

```
//typescript
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node ts-node typechain typescript


```

step 5 create all ignore file
step 6 import required module in hardhat config file
step 7 create folder for contract, deploy, test
step 8 lottery contract

-   anyone can enter into lottery
-   random winner
-   generate random number -> chainlink
-   automatical trigger function when certain time occur

To used link Random number we have to link our account to it get subcribution code
tell which contract is going to used it.\

# hardhat short cut

yarn globa add hardhat-shorthand

# Chainlink

it will help us to implement orical which help as to get data from real work like random number we are going to used chainlink in our contract

-   we need to link our account to chainlink
-   subscribe the chainlink contract
-   tell which contract is going to used our this subcribations

# hardhat network

it will help as to change blockchain setting and like blocktime, mine new block so much more
https://hardhat.org/hardhat-network/docs/reference

This to line make changes in hardhat local node first we edit time and increace with some limit and new block for reflect changes

```
                  network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  network.provider.send("evm_mine", [])
```

if we just want to simulate the transaction instated of doing transactions we used "callStatic"

```
                  var { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
```
