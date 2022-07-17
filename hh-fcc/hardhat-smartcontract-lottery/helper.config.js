const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "localhost",
        KeyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        entrnaceFee: ethers.utils.parseEther("0.01"),
        callbackGasLimit: "50000",
        interval: "30",
    },
    3: {
        name: "ropsten",
    },
    4: {
        name: "rinkeby",
        LINKAddress: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
        VRFCoordinatorV2Mock: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        KeyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        entrnaceFee: ethers.utils.parseEther("0.01"),
        subscriptionId: "8365",
        callbackGasLimit: "50000",
        interval: "30",
    },
}
const developmentChains = ["hardhat", "localhost"]

// 0x812F89E73e6C4ce1c68337D9FEB482200D0fC268
// 0x717925D5c09D9f58768c997AB1a829891bBd5039
module.exports = { networkConfig, developmentChains }
