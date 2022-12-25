const Web3 = require("web3");

const RPC_ENDPOINT =
  "wss://mainnet.infura.io/ws/v3/eb19eeafefff4d9eb07ed30adcad89a1";

const web3 = new Web3(RPC_ENDPOINT);
// const subscription = web3.eth.subscribe("newBlockHeaders", (err, result) => {
//   const { number } = result;
//   console.log(number);
// });

let options = {
  fromBlock: "15663324",
  address: ["0x3506424f91fd33084466f402d5d97f05f8e3b4af"], //Only get events from specific addresses
  topics: [web3.utils.sha3("Transfer(address,address,uint256)")], //What topics to subscribe to
};

let subscription = web3.eth.subscribe("logs", options, (err, event) => {
  if (!err) console.log(event);
});
// console.log("subscription", subscription);
// subscription.on("data", (event) => console.log("data ", event));
// subscription.on("changed", (changed) => console.log("changed", changed));
// subscription.on("arguments", (arguments) =>
//   console.log("arguments", arguments)
// );

// subscription.on("error", (err) => {
//   throw err;
// });
subscription.on("connected", (nr) => console.log("connected", nr));
