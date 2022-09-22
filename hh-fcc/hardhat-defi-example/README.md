# DEFI

We are doing simple example of defi application with AAVE

1. Deposit collaterial : ETH/WETH // this monwy on which we borrow money from the DEFI
2. Borrow Assest : DAI coin for testing
3. Repay DAI

In this example we are not going to deploy any contract we write scripte which Intract with AAVE

## Step's

First We need WETH token to intract with AAVE beacuse both are ERC20 Stander

`getWeth.js` here we create our script to covert our ethereum into WETH
We need ABI so we add interfact of WETH which is similar to ERC20 Token and get contract address from your testnet like Rinkeby (0xc778417E063141139Fce010982780140Aa0cD5Ab) or mainnet Address (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)

## forking mainnet blockchain

Forking mean run mainnet chain local in our machine but it will not effect any thing on real mainnet or chain it is just dummy
to do this we will used hardhat

```
https://hardhat.org/hardhat-network/docs/guides/forking-other-networks
```

To do achive this we need key from Infura or Alchemy to intract with mainnet chain

## Next Connect to AAVE

For that we need some approch connect to the AAVE contract for that we need ABI and Contract Address
Go to AAVE website and get lending pool contract address -> this is special contract who have list of update AAVE contract Address

Copy address

```
https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
```

`getLendingPool` this function will return us the latest address on landing pool which we used to intract with AAVE

## Lending Pool

Now it time to connect/get lending pool contract from it address we have address the thing is need the ABI

```
https://github.com/aave/protocol-v2/blob/1.0/contracts/interfaces/ILendingPool.sol
```

copy Interface from here

and install dependence with npm
`https://www.npmjs.com/package/@aave/protocol-v2`

once it install change the import path with

```

import {ILendingPoolAddressesProvider} from "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import {DataTypes} from "@aave/protocol-v2/contracts/protocol/libraries/types/DataTypes.sol";
```

command to run and Test

```
hh run scripts/aave.Borrow.js
```
