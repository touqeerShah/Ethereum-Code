const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper.config")
developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me ", function () {
          console.log(
              "developmentChains.includes(network.name)",
              developmentChains.includes(network.name)
          )

          let lottery, deployer, raffleEntranceFee, lotteryContract
          beforeEach(async function () {
              // deploy the contract on hard hardhat-deploy we will used
              // deployments -> it will run all the deployment script with tag

              deployer = (await getNamedAccounts()).deployer
              lottery = await ethers.getContract("Lottery") // Returns a new connection to the Raffle contract
              console.log("0x4c484d39821E6d5AF7d727845B8352618bd74732", lottery.address)
              raffleEntranceFee = await lottery.getEntranceFee()
          })

          describe("Constractor ", function () {
              it("Should return the vrfCoordinatorV2Mock similer which is return ", async function () {
                  var interval = await lottery.getInterval()
                  await expect(interval).to.equal("30")
              })
          })
          describe(" fulfillRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
                  // enter the lottery
                  console.log("Setting up test...")
                  const startingTimeStamp = await lottery.getLastTimeStamp()
                  const accounts = await ethers.getSigners()

                  console.log("Setting up Listener...")
                  await new Promise(async (resolve, reject) => {
                      // setup listener before we enter the lottery
                      // Just in case the blockchain moves REALLY fast
                      lottery.once("WinnerPicked", async () => {
                          console.log("WinnerPicked event fired!")
                          try {
                              // add our asserts here
                              const recentWinner = await lottery.getRecentWinner()
                              const raffleState = await lottery.getRaffleState()
                              const winnerEndingBalance = await accounts[0].getBalance()
                              const endingTimeStamp = await lottery.getLastTimeStamp()

                              await expect(lottery.getPlayer(0)).to.be.reverted
                              assert.equal(recentWinner.toString(), accounts[0].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerEndingBalance.toString(),
                                  winnerStartingBalance.add(raffleEntranceFee).toString()
                              )
                              assert(endingTimeStamp > startingTimeStamp)
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject(error)
                          }
                      })
                      // Then entering the lottery
                      console.log("Entering Raffle...", raffleEntranceFee)
                      const tx = await lottery.enternaceLottery({ value: raffleEntranceFee })
                      await tx.wait(1)
                      console.log("Ok, time to wait...")
                      const winnerStartingBalance = await accounts[0].getBalance()

                      // and this code WONT complete until our listener has finished listening!
                  })
              })
          })
      })
