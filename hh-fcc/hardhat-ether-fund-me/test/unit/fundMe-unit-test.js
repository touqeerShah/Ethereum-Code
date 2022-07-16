const { expect, assert } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");

const { developmentChains } = require("../../helper.config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fund Me ", function () {
      let fundme, deployer, markV3agre;
      const sendEther = ethers.utils.parseEther("1");
      beforeEach(async function () {
        // deploy the contract on hard hardhat-deploy we will used
        // deployments -> it will run all the deployment script with tag
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture("all"); // it will run all the deployment file tag == > all
        fundme = await ethers.getContract("FundMe", deployer);
        markV3agre = await ethers.getContract("MockV3Aggregator", deployer);
      });
      describe("Constractor ", function () {
        it("Should return the markV3agre similer which is return ", async function () {
          var markv3Address = await fundme.getPriceFeed();
          console.log("markv3Address ==>", markv3Address);
          await expect(markv3Address).to.equal(markV3agre.address);
        });
      });

      describe("Fund ", function () {
        it("check it failed on not enogth found ", async function () {
          // this is more helpful when you want to want code check without break
          //   await expect(fundme.fund()).to.be.revertedWith(
          //     " You Need to spend more ether "
          //   );
          await expect(fundme.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("check update the amount  ", async function () {
          await fundme.fund({ value: sendEther });
          var response = await fundme.getAddressToAmountFunded(deployer);
          console.log(response);
          assert.equal(sendEther.toString(), response.toString());
        });

        it("check add funder  ", async function () {
          await fundme.fund({ value: sendEther });
          var response = await fundme.getFunder(0);
          console.log(response);
          assert.equal(deployer, response.toString());
        });
      });

      describe("WithDraw Fund ", function () {
        beforeEach(async function () {
          // before starting testing we need to fund the contract
          await fundme.fund({ value: sendEther });
        });
        it("withDraw ether from single funder", async function () {
          // this is more helpful when you want to want code check without break
          var startFundBalance = await fundme.provider.getBalance(
            fundme.address
          );
          var startDeployerBalance = await fundme.provider.getBalance(deployer);
          console.log(
            startFundBalance.toString(),
            startDeployerBalance.toString()
          );
          var transactionResponse = await fundme.withdraw();
          var transactionRecepit = await transactionResponse.wait(0);
          var { gasUsed, effectiveGasPrice } = transactionRecepit;
          var gasCost = gasUsed.mul(effectiveGasPrice);
          console.log("gasCost", gasCost.toString());

          var endingFundBalance = await fundme.provider.getBalance(
            fundme.address
          );
          var endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          console.log(
            "endingDeployerBalance",
            endingDeployerBalance.toString()
          );

          assert.equal(endingFundBalance, 0);
          assert.equal(
            startDeployerBalance.add(startFundBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });
        it("is allows us to withdraw with multiple funders", async () => {
          // Arrange
          const accounts = await ethers.getSigners();
          for (i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundme.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendEther });
          }
          const startingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const startingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );

          // Act
          const transactionResponse = await fundme.cheaperWithdraw();
          // Let's comapre gas costs :)
          // const transactionResponse = await fundme.withdraw()
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const withdrawGasCost = gasUsed.mul(effectiveGasPrice);
          console.log(`GasCost: ${withdrawGasCost}`);
          console.log(`GasUsed: ${gasUsed}`);
          console.log(`GasPrice: ${effectiveGasPrice}`);
          const endingFundMeBalance = await fundme.provider.getBalance(
            fundme.address
          );
          const endingDeployerBalance = await fundme.provider.getBalance(
            deployer
          );
          // Assert
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(withdrawGasCost).toString()
          );
          // Make a getter for storage variables
          await expect(fundme.getFunder(0)).to.be.reverted;

          for (i = 1; i < 6; i++) {
            assert.equal(
              await fundme.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });
        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const fundMeConnectedContract = await fundme.connect(accounts[1]);
          //   await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
          //     "FundMe__NotOwner"
          //   );
          await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });
      });
    });
