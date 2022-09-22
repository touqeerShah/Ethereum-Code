const { getNamedAccounts, ethers } = require("hardhat")

async function getWeth() {
    let sendEther = ethers.utils.parseEther("0.01")

    // first we need account to intract
    const { deployer } = await getNamedAccounts()
    //to intract with WETH contract we need ABI and contract address
    //0xc778417E063141139Fce010982780140Aa0cD5Ab
    const iweth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    var tx = await iweth.deposit({ value: sendEther })
    await tx.wait(1)
    var balance = await iweth.balanceOf(deployer)
    console.log("balance", balance.toString())
}
module.exports = { getWeth }
