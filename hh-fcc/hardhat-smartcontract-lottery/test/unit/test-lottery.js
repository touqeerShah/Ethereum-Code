const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me ", function () {
          let lottery, deployer, player, vrfCoordinatorV2Mock, interval, lotteryContract, accounts
          let sendEther = ethers.utils.parseEther("1")
          beforeEach(async function () {
              // deploy the contract on hard hardhat-deploy we will used
              // deployments -> it will run all the deployment script with tag
              accounts = await ethers.getSigners() // could also do with getNamedAccounts

              deployer = (await getNamedAccounts()).deployer
              player = (await getNamedAccounts()).player

              await deployments.fixture("all") // it will run all the deployment file tag == > all
              lotteryContract = await ethers.getContract("Lottery") // Returns a new connection to the Raffle contract
              lottery = lotteryContract.connect(player) // Ret
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              interval = await lottery.getInterval()
              sendEther = await lottery.getEntranceFee()
          })
          describe("Constractor ", function () {
              it("Should return the vrfCoordinatorV2Mock similer which is return ", async function () {
                  var interval = await lottery.getInterval()
                  await expect(interval).to.equal("30")
              })
          })
          describe("Entet Lottery ", function () {
              it("check it failed on not money send", async function () {
                  // this is more helpful when you want to want code check without break
                  //   await expect(lottery.fund()).to.be.revertedWith(
                  //     " You Need to spend more ether "
                  //   );

                  await expect(lottery.enternaceLottery()).to.be.revertedWith(
                      "Lottery__NOTEnougthETHEnter"
                  )
              })
              it("check it failed on less money send", async function () {
                  sendEther = ethers.utils.parseEther("0.01")
                  await expect(lottery.enternaceLottery()).to.be.revertedWith(
                      "Lottery__NOTEnougthETHEnter"
                  )
              })

              it("check it  enter in lottery  money send", async function () {
                  sendEther = await lottery.getEntranceFee()
                  console.log("====> ", sendEther.toString())
                  await lottery.enternaceLottery({ value: sendEther })
                  var response = await lottery.getPlayer(0)
                  console.log(response)
                  assert.equal(deployer, response.toString())
              })
              it("check it  enter in lottery Event", async function () {
                  sendEther = await lottery.getEntranceFee()
                  await expect(lottery.enternaceLottery({ value: sendEther })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
              })
              it("does not allow to enter once lottery close", async function () {
                  sendEther = await lottery.getEntranceFee()
                  await expect(lottery.enternaceLottery({ value: sendEther })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
                  network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  network.provider.send("evm_mine", [])
                  await lottery.performUpkeep([])
                  await expect(lottery.enternaceLottery({ value: sendEther })).to.be.revertedWith(
                      "Lottery__NOTOPEN"
                  )
              })
          })

          describe("checkUpkeep ", function () {
              it("check checkUpkeep it fail on if their is no players", async function () {
                  network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  network.provider.send("evm_mine", [])
                  var { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                  console.log(upkeepNeeded)
                  assert(!upkeepNeeded)
              })
              it("check checkUpkeep it fail on if is lottery is close", async function () {
                  sendEther = await lottery.getEntranceFee()
                  await expect(lottery.enternaceLottery({ value: sendEther })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
                  network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  network.provider.send("evm_mine", [])
                  await lottery.performUpkeep([])
                  var { upkeepNeeded } = await lottery.callStatic.checkUpkeep([])
                  var res = await lottery.getRaffleState()
                  assert.equal("1", res.toString())

                  assert(!upkeepNeeded)
              })

              it("returns false if enough time hasn't passed", async () => {
                  await lottery.enternaceLottery({ value: sendEther })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() - 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                  assert(!upkeepNeeded)
              })
              it("returns true if enough time has passed, has players, eth, and is open", async () => {
                  await lottery.enternaceLottery({ value: sendEther })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const { upkeepNeeded } = await lottery.callStatic.checkUpkeep("0x") // upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers)
                  assert(upkeepNeeded)
              })
          })
          describe("performUpkeep ", function () {
              it("it work only if checkUpkeep is true", async function () {
                  await expect(lottery.enternaceLottery({ value: sendEther })).to.emit(
                      lottery,
                      "LotteryEnter"
                  )
                  network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  network.provider.send("evm_mine", [])
                  var tx = await lottery.performUpkeep([])
                  assert(tx)
              })
              it("reverts if checkup is false", async () => {
                  await expect(lottery.performUpkeep("0x")).to.be.revertedWith(
                      "Lottery__UpKeepNotNeeded"
                  )
              })
              it("updates the lottery state and emits a requestId", async () => {
                  // Too many asserts in this test!
                  await lottery.enternaceLottery({ value: sendEther })
                  await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
                  await network.provider.request({ method: "evm_mine", params: [] })
                  const txResponse = await lottery.performUpkeep("0x") // emits requestId
                  const txReceipt = await txResponse.wait(1) // waits 1 block
                  const raffleState = await lottery.getRaffleState() // updates state
                  const requestId = txReceipt.events[1].args.requidID
                  console.log("requestId", requestId)
                  assert(requestId.toNumber() > 0)
                  assert(raffleState == 1) // 0 = open, 1 = calculating
              })
              it("picks a winner, resets, and sends money", async () => {
                  const additionalEntrances = 3 // to test
                  const startingIndex = 2
                  for (let i = startingIndex; i < startingIndex + additionalEntrances; i++) {
                      // i = 2; i < 5; i=i+1
                      lottery = lotteryContract.connect(accounts[i]) // Returns a new instance of the Raffle contract connected to player
                      await lottery.enternaceLottery({ value: sendEther })
                  }
                  const startingTimeStamp = await lottery.getLastTimeStamp() // stores starting timestamp (before we fire our event)

                  // This will be more important for our staging tests...
                  await new Promise(async (resolve, reject) => {
                      lottery.once("WinnerPicked", async () => {
                          // event listener for WinnerPicked
                          console.log("WinnerPicked event fired!")
                          // assert throws an error if it fails, so we need to wrap
                          // it in a try/catch so that the promise returns event
                          // if it fails.
                          try {
                              // Now lets get the ending values...
                              const recentWinner = await lottery.getRecentWinner()
                              const raffleState = await lottery.getRaffleState()
                              const winnerBalance = await accounts[2].getBalance()
                              const endingTimeStamp = await lottery.getLastTimeStamp()
                              await expect(lottery.getPlayer(0)).to.be.reverted
                              // Comparisons to check if our ending values are correct:
                              assert.equal(recentWinner.toString(), accounts[2].address)
                              assert.equal(raffleState, 0)
                              assert.equal(
                                  winnerBalance.toString(),
                                  startingBalance // startingBalance + ( (sendEther * additionalEntrances) + raffleEntranceFee )
                                      .add(sendEther.mul().add(sendEther))
                                      .toString()
                              )
                              //   assert(endingTimeStamp > startingTimeStamp)
                              resolve() // if try passes, resolves the promise
                          } catch (e) {
                              reject(e) // if try fails, rejects the promise
                          }
                      })

                      const tx = await lottery.performUpkeep("0x")
                      const txReceipt = await tx.wait(1)
                      const startingBalance = await accounts[2].getBalance()
                      console.log("startingBalance", startingBalance)
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          lottery.address
                      )
                  })
              })
          })
      })
