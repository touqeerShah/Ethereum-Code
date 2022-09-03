let { networkConfig, developmentChains } = require("../helper.config.js")
let { verify } = require("../utils/verify")

require("dotenv").config()
const FUND_AMOUNT = "1000000000000000000000"

module.exports = async ({ getNamedAccounts, deployments, getChainId, network }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const chainId = await getChainId()

    log("--------------------------------")

    var vrfCoordinatorV2MockAddress, subscriptionId

    if (chainId == 4) {
        console.log(
            "networkConfig[chainId].etherUSDPriceFeed;",
            networkConfig[chainId].etherUSDPriceFeed
        )
        vrfCoordinatorV2MockAddress = networkConfig[chainId].VRFCoordinatorV2Mock
        subscriptionId = networkConfig[chainId].subscriptionId
    } else {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2MockAddress = vrfCoordinatorV2Mock.address
        console.log("vrfCoordinatorV2MockAddress==>", vrfCoordinatorV2MockAddress)
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
    }
    log("Network is detected to be mock")
    console.log("vrfCoordinatorV2MockAddress", vrfCoordinatorV2MockAddress)
    console.log("subscriptionId", subscriptionId.toString())
    var entrnaceFee = networkConfig[chainId].entrnaceFee
    var KeyHash = networkConfig[chainId].KeyHash
    var callbackGasLimit = networkConfig[chainId].callbackGasLimit
    var interval = networkConfig[chainId].interval
    console.log("entrnaceFee ====>", entrnaceFee.toString())
    // const lottery = await deploy("Lottery", {
    //     from: deployer,
    //     args: [
    //         vrfCoordinatorV2MockAddress,
    //         entrnaceFee,
    //         subscriptionId,
    //         KeyHash,
    //         callbackGasLimit,
    //         interval,
    //     ],
    //     log: true,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })
    // log(`lottery contract is deployed on local network to ${lottery.address} ${chainId}`)

    // if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
    //     await verify(lottery.address, [
    //         vrfCoordinatorV2MockAddress,
    //         entrnaceFee,
    //         subscriptionId,
    //         KeyHash,
    //         callbackGasLimit,
    //         interval,
    //     ])
    // }
    const roffle = await deploy("Raffle", {
        from: deployer,
        args: [
            vrfCoordinatorV2MockAddress,
            subscriptionId,
            KeyHash,
            interval,
            entrnaceFee,
            callbackGasLimit,
        ],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`roffle contract is deployed on local network to ${roffle.address} ${chainId}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(roffle.address, [
            vrfCoordinatorV2MockAddress,
            subscriptionId,
            KeyHash,
            interval,
            entrnaceFee,
            callbackGasLimit,
        ])
    }
}
module.exports.tags = ["fund", "all"]
