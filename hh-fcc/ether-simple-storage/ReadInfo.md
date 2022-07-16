install yarn
install solc
then compile the code with solc commad
yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . ./SimpleStorage.sol
then add this command into package.json file to compile
next step we will deployed our network on ganache
and used ethers libarary

add your private key and URL into .env
add dotenv module

We can store key in encrypted so no one can ready it
and used tha encrypted key with wallet
