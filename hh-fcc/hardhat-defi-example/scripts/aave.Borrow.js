const { getWeth } = require("./getWeth")
async function main() {
    await getWeth()
    const lendingPool = await getLendingPoolAddress()
    console.log("lendingPool ==> ", lendingPool.address)
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

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
