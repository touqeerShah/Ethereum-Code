const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me ", function () {
          let lottery, deployer, sendEther, lotteryContract
          beforeEach(async function () {
              // deploy the contract on hard hardhat-deploy we will used
              // deployments -> it will run all the deployment script with tag

              deployer = (await getNamedAccounts()).deployer
              lotteryContract = await ethers.getContract("Lottery") // Returns a new connection to the Raffle contract
              sendEther = await lottery.getEntranceFee()
          })
          describe("Constractor ", function () {
              it("Should return the vrfCoordinatorV2Mock similer which is return ", async function () {
                  var interval = await lottery.getInterval()
                  await expect(interval).to.equal("30")
              })
          })
      })
