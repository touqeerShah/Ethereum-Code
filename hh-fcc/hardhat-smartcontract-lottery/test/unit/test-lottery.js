const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper.config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me ", function () {
          let lottery, deployer, player, vrfCoordinatorV2Mock, interval
          let sendEther = ethers.utils.parseEther("1")
          beforeEach(async function () {
              // deploy the contract on hard hardhat-deploy we will used
              // deployments -> it will run all the deployment script with tag
              deployer = (await getNamedAccounts()).deployer
              player = (await getNamedAccounts()).player

              await deployments.fixture("all") // it will run all the deployment file tag == > all
              lottery = await ethers.getContract("Lottery", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              interval = await lottery.getInterval()
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

          //   describe("WithDraw Fund ", function () {
          //       beforeEach(async function () {
          //           // before starting testing we need to fund the contract
          //           await lottery.fund({ value: sendEther })
          //       })
          //       it("withDraw ether from single funder", async function () {
          //           // this is more helpful when you want to want code check without break
          //           var startFundBalance = await lottery.provider.getBalance(lottery.address)
          //           var startDeployerBalance = await lottery.provider.getBalance(deployer)
          //           console.log(startFundBalance.toString(), startDeployerBalance.toString())
          //           var transactionResponse = await lottery.withdraw()
          //           var transactionRecepit = await transactionResponse.wait(0)
          //           var { gasUsed, effectiveGasPrice } = transactionRecepit
          //           var gasCost = gasUsed.mul(effectiveGasPrice)
          //           console.log("gasCost", gasCost.toString())

          //           var endingFundBalance = await lottery.provider.getBalance(lottery.address)
          //           var endingDeployerBalance = await lottery.provider.getBalance(deployer)
          //           console.log("endingDeployerBalance", endingDeployerBalance.toString())

          //           assert.equal(endingFundBalance, 0)
          //           assert.equal(
          //               startDeployerBalance.add(startFundBalance).toString(),
          //               endingDeployerBalance.add(gasCost).toString()
          //           )
          //       })
          //       it("is allows us to withdraw with multiple funders", async () => {
          //           // Arrange
          //           const accounts = await ethers.getSigners()
          //           for (i = 1; i < 6; i++) {
          //               const fundMeConnectedContract = await lottery.connect(accounts[i])
          //               await fundMeConnectedContract.fund({ value: sendEther })
          //           }
          //           const startingFundMeBalance = await lottery.provider.getBalance(lottery.address)
          //           const startingDeployerBalance = await lottery.provider.getBalance(deployer)

          //           // Act
          //           const transactionResponse = await lottery.cheaperWithdraw()
          //           // Let's comapre gas costs :)
          //           // const transactionResponse = await lottery.withdraw()
          //           const transactionReceipt = await transactionResponse.wait()
          //           const { gasUsed, effectiveGasPrice } = transactionReceipt
          //           const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
          //           console.log(`GasCost: ${withdrawGasCost}`)
          //           console.log(`GasUsed: ${gasUsed}`)
          //           console.log(`GasPrice: ${effectiveGasPrice}`)
          //           const endingFundMeBalance = await lottery.provider.getBalance(lottery.address)
          //           const endingDeployerBalance = await lottery.provider.getBalance(deployer)
          //           // Assert
          //           assert.equal(
          //               startingFundMeBalance.add(startingDeployerBalance).toString(),
          //               endingDeployerBalance.add(withdrawGasCost).toString()
          //           )
          //           // Make a getter for storage variables
          //           await expect(lottery.getFunder(0)).to.be.reverted

          //           for (i = 1; i < 6; i++) {
          //               assert.equal(await lottery.getAddressToAmountFunded(accounts[i].address), 0)
          //           }
          //       })
          //       it("Only allows the owner to withdraw", async function () {
          //           const accounts = await ethers.getSigners()
          //           const fundMeConnectedContract = await lottery.connect(accounts[1])
          //           //   await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
          //           //     "FundMe__NotOwner"
          //           //   );
          //           await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
          //               "FundMe__NotOwner"
          //           )
          //       })
          //   })
      })
