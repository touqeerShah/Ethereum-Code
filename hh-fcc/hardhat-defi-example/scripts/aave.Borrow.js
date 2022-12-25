const { getNamedAccounts, ethers } = require("hardhat")

const { getWeth, sendEther } = require("./getWeth")
async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()

    const lendingPool = await getLendingPoolAddress()
    console.log("lendingPool ==> ", lendingPool.address)
    // deposite
    var iweth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    //approved
    await approveERC20(iweth, lendingPool.address, sendEther, deployer)
    await lendingPool.deposit(iweth, sendEther, deployer, 0)
    console.log("deposited...! ")
    // get user account how much it  can borrwo
    var obj = await getAccountData(lendingPool, deployer)
    /// get DAI price from oricale so we can convert how much we can borrow
    var DAIPrice = await getPrice()
    console.log("DAIPrice ", DAIPrice.toNumber())

    // convert Ethet to DAI
    //  0.95 donot spend all money only 95 of total will be invest
    var amountDAItoBorrow = obj.availableBorrowsETH.toString() * 0.95 * (1 / DAIPrice.toNumber())
    console.log("amountDAItoBorrow =", amountDAItoBorrow)
    let amountDAItoBorrowWEI = ethers.utils.parseEther(amountDAItoBorrow.toString())
    //DAI mainnet 0x6B175474E89094C44Da98b954EedeAC495271d0F
    await borrowAmount(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        lendingPool,
        amountDAItoBorrowWEI,
        deployer
    )

    //Repay
    await repay(
        "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        lendingPool,
        amountDAItoBorrowWEI,
        deployer
    )
    await getAccountData(lendingPool, deployer)
}

async function getLendingPoolAddress() {
    //abi and contract address 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    const { deployer } = await getNamedAccounts()
    //to intract with WETH contract we need ABI and contract address
    const ilenderPool = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        deployer
    )

    const poolAddress = await ilenderPool.getLendingPool()
    console.log("poolAddress", poolAddress)
    const lendingPool = await ethers.getContractAt("ILendingPool", poolAddress, deployer)
    return lendingPool
}

async function getAccountData(landingpool, account) {
    var {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    } = await landingpool.getUserAccountData(account)
    console.log(
        "totalCollateralETH ",
        totalCollateralETH.toString(),
        "\ntotalDebtETH ",
        totalDebtETH.toString(),
        "\navailableBorrowsETH ",
        availableBorrowsETH.toString(),
        "\ncurrentLiquidationThreshold ",
        currentLiquidationThreshold.toString(),
        "\nltv ",
        ltv.toString(),
        "\nhealthFactor ",
        healthFactor.toString()
    )
    return {
        totalCollateralETH,
        totalDebtETH,
        availableBorrowsETH,
        currentLiquidationThreshold,
        ltv,
        healthFactor,
    }
}

async function getPrice(amount, account) {
    var oricaleContract = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4",
        account
    )
    var price = (await oricaleContract.latestRoundData())[1] // it will return an array and we need only answer
    // await tx.wait(1)
    console.log("oricaleContract")
    return price
}
async function approveERC20(contractAddres, spenderAddress, amount, account) {
    var erc20 = await ethers.getContractAt("IERC20", contractAddres, account)
    var tx = await erc20.approve(spenderAddress, amount)
    await tx.wait(1)
    console.log("Approved")
}
async function borrowAmount(daiAddress, landingpool, ammountDaiToWei, account) {
    var tx = await landingpool.borrow(daiAddress, ammountDaiToWei, 1, 0, account)
    await tx.wait(1)
    console.log("Borrow DAI")
}
async function repay(daiAddress, landingpool, ammountDaiToWei, account) {
    await approveERC20(daiAddress, landingpool.address, ammountDaiToWei, account)
    var tx = await landingpool.repay(daiAddress, ammountDaiToWei, 1, account)
    await tx.wait(1)
    console.log("repay DAI")
}
main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
