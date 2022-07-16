let { networkConfig, developmentChains } = require("../helper.config.js")
let { verify } = require("../utils/verify")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments, getChainId, network }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const chainId = await getChainId()

    log("--------------------------------")

    var vrfCoordinatorV2MockAddress

    if (chainId == 4) {
        console.log(
            "networkConfig[chainId].etherUSDPriceFeed;",
            networkConfig[chainId].etherUSDPriceFeed
        )
        vrfCoordinatorV2MockAddress = networkConfig[chainId].etherUSDPriceFeed
    } else {
        const VRFCoordinatorV2Mock = await get("VRFCoordinatorV2Mock")
        log(
            `Your contract is deployed on local network to ${VRFCoordinatorV2Mock.address} ${chainId}`
        )
        vrfCoordinatorV2MockAddress = VRFCoordinatorV2Mock.address
    }
    log("Network is detected to be mock")
    console.log("vrfCoordinatorV2MockAddress", vrfCoordinatorV2MockAddress)
    const funMe = await deploy("FundMe", {
        from: deployer,
        args: [vrfCoordinatorV2MockAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`funMe contract is deployed on local network to ${funMe.address} ${chainId}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(funMe.address, [vrfCoordinatorV2MockAddress])
    }
}
module.exports.tags = ["fund", "all"]
