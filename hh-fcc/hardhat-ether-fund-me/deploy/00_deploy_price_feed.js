let { developmentChains } = require("../helper.config.js");
const DECIMALS = "8";
const INITIAL_PRICE = "200000000000"; // 2000
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts(); // it will tell the who is going to deploy the contract
  const name = await network.name;

  log("--------------------------------", name);

  if (developmentChains.includes(name)) {
    log("Network is detected to be mock");
    const mockV3Aggregator = await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    });
    log(
      `mockV3Aggregator contract is deployed on local network to ${mockV3Aggregator.address} ${name}`
    );
  }
};
module.exports.tags = ["all", "mocks"];
