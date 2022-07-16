var ethers = require("ethers");
var fs = require("fs-extra");
require("dotenv").config();
async function main() {
  const provide = new ethers.providers.JsonRpcProvider(
    process.env.PROVIDER_URL
  );
  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provide);
  var encryptJsonKey = fs.readFileSync("./.encryptJsonKey.json", "utf8"); // here we read incrypted key
  console.log(encryptJsonKey);
  // here we can decrypted key
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptJsonKey,
    process.env.PASSWORD
  );

  wallet = await wallet.connect(provide); // here we connect to provider key

  var abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  var binaray = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binaray, wallet);
  console.log("Deploy contract on local ganache ...");
  const contract = await contractFactory.deploy();
  const deploymentResponse = await contract.deployTransaction.wait(1); // test the deployment by doing one transaction
  console.log("contract.deploymendt", contract.deployTransaction);

  console.log("deploymentResponse", deploymentResponse);
  var currentFavoriteNumber = await contract.retrieve();
  console.log("currentFavoriteNumber", currentFavoriteNumber.toString());
  var transactionResponse = await contract.store("32");
  console.log("transactionResponse", transactionResponse);
  var transactionReceipt = await transactionResponse.wait(1);
  console.log("transactionReceipt", transactionReceipt);
  var updatedFavoriteNumber = await contract.retrieve();
  console.log("updatedFavoriteNumber", updatedFavoriteNumber.toString());

  //let deploy contrant as transaction because deploy contract is just a transaction
  // const nonce = await wallet.getTransactionCount();
  // var tx = {
  //   nonce: nonce,
  //   gasPrice: 20000000000,
  //   gasLimit: 1000000,
  //   to: null,
  //   value: 0,
  //   data: "0x" + binaray,
  //   chainId: 1337,
  // };
  // var sendTxResponse = await wallet.sendTransaction(tx);
  // console.log("sendTxResponse", sendTxResponse);
  // var signTxResponse = sendTxResponse.wait(1);
  // console.log("signTxResponse", signTxResponse);
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
  });
