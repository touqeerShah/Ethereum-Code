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
yarn add hardhat-deploy
```

https://github.com/wighawag/hardhat-deploy

Since hardhat-deploy-ethers is a fork of @nomiclabs/hardhat-ethers and that other plugin might have an hardcoded dependency on @nomiclabs/hardhat-ethers the best way to install hardhat-deploy-ethers and ensure compatibility is the following:

```
yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```
