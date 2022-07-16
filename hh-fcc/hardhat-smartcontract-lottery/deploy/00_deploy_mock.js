const { ethers } = require("hardhat")
let { developmentChains } = require("../helper.config.js")
const BASEFEE = ethers.utils.parseEther("0.25") // it will be the cost of 0,25 link to call random number
const Gas_Price_link = 1e9 // 1000000000
module.exports = async ({ getNamedAccounts, deployments, network }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const name = await network.name

    log("--------------------------------", name)

    if (developmentChains.includes(name)) {
        log("Network is detected to be mock")
        const vrfCoordinatorV2Mock = await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            args: [BASEFEE, Gas_Price_link],
        })
        log(
            `vrfCoordinatorV2Mock contract is deployed on local network to ${vrfCoordinatorV2Mock.address} ${name}`
        )
    }
}
module.exports.tags = ["all", "mocks"]
