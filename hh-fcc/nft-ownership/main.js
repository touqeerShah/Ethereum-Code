// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: "dxTLSLwmTGaILTzEg94Fck8yjYL1qA_y",
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

const main = async () => {
  // Get all NFTs
  // var nfts = await alchemy.nft.getNftsForOwner(
  //   "0x04FE0F4C91F8e55c9E4BE7f4353C509DaD066CD5",
  //   { pageSize: 100 }
  // );
  // // Print NFTs
  // console.log(nfts.ownedNfts);
  var nfts = await alchemy.nft.getOwnersForNft(
    "0x2fdb3f12e7a139cc01a488050063ecfde2dd7f2c",
    "52"
  );
  // Print NFTs
  console.log(nfts);
  // var ownNFTs = {};
  // nfts.ownedNfts.reduce((contract, items) => {
  //   // const group = (groups[items.group] || []);
  //   if (!Object.keys(ownNFTs).includes(items.contract.name)) {
  //     ownNFTs[items.contract.name] = [];
  //   }
  //   ownNFTs[items.contract.name].push(items);
  // }, {});
  // console.log("contract", ownNFTs);
  // return ownNFTs;
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
