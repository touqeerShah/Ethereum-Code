const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("simple Storage", function () {
  let SimpleStorageFactory, simpleStorage;
  beforeEach(async function () {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
  });
  it("Should return the number as Zero", async function () {
    var currentValue = await simpleStorage.retrieve();
    expect(currentValue.toString()).to.equal("0");
  });
  it("Should return the number as Updated Value", async function () {
    var transactionResponse = await simpleStorage.store("32");
    await transactionResponse.wait(1);

    assert(await simpleStorage.retrieve().toString(), "32");
  });
});
