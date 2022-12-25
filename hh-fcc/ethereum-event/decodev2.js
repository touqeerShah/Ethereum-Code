var ethers = require("ethers");
const RPC_ENDPOINT =
  "wss://mainnet.infura.io/ws/v3/eb19eeafefff4d9eb07ed30adcad89a1";

let provider = ethers.provider(RPC_ENDPOINT);
let filterLog = {
  fromBlock: blockNumber,
  toBlock: blockNumber,
  topics: [
    "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1", // sync
  ],
};
// await provider.getLogs(filterLog).then((logList) => {
