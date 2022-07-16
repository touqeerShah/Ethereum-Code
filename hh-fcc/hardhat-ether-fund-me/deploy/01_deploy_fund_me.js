let { networkConfig, developmentChains } = require("../helper.config.js");
let { verify } = require("../utils/verify");

require("dotenv").config();

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
  network,
}) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts(); // it will tell the who is going to deploy the contract
  const chainId = await getChainId();

  log("--------------------------------");

  var ethUsdPriceFeedAddress;

  if (chainId == 4) {
    console.log(
      "networkConfig[chainId].etherUSDPriceFeed;",
      networkConfig[chainId].etherUSDPriceFeed
    );
    ethUsdPriceFeedAddress = networkConfig[chainId].etherUSDPriceFeed;
  } else {
    const MockV3Aggregator = await get("MockV3Aggregator");
    log(
      `Your contract is deployed on local network to ${MockV3Aggregator.address} ${chainId}`
    );
    ethUsdPriceFeedAddress = MockV3Aggregator.address;
  }
  log("Network is detected to be mock");
  console.log("ethUsdPriceFeedAddress", ethUsdPriceFeedAddress);
  const funMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(
    `funMe contract is deployed on local network to ${funMe.address} ${chainId}`
  );

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCANAPIKEY
  ) {
    await verify(funMe.address, [ethUsdPriceFeedAddress]);
  }
};
module.exports.tags = ["fund", "all"];
