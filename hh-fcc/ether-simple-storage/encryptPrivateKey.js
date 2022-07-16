var ethers = require("ethers");
var fs = require("fs-extra");
require("dotenv").config();
async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  var enryptedJsonKey = await wallet.encrypt(
    process.env.PASSWORD,
    process.env.PRIVATE_KEY
  );
  fs.writeFileSync("./.encryptJsonKey.json", enryptedJsonKey);
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
  });
