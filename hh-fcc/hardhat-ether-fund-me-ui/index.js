import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constant.js";

console.log("script import");

// here we will get our html object
const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
//here we will do action on it
connectButton.onclick = connect;
withdrawButton.onclick = withdraw;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    alert("Please install MetaMask");
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (ethAmount === "") {
    alert("Please Enter Fund Amount ");
  } else {
    console.log("ethAmount ==>", ethAmount);
    console.log(`Funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
      // it will connect to matemask and get provider URL link Rinkeby and Mainnet

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // this will return the address of account which is selected in matemask

      const signer = provider.getSigner();
      // here we provide ABI which we copy from deployment folder with hardhat and contract address on test rinkeby
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        console.log("contract", contract);
        // here we will do our first transaction
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethAmount),
        });
        console.log("transactionResponse", transactionResponse);
        await listenForTransactionMine(transactionResponse, provider);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please install MetaMask");
    }
  }
}
async function withdraw() {
  console.log(`Withdrawing...`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
  }
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}
