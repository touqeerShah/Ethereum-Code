// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.0;

// 2. Imports
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./helper.sol";
// 3. Interfaces, Libraries, Contracts
error PTNFT__NotOwner();
error PTNFT__ONLYMARKETPLACE();

/**@title A Pharmatrace  NFT contract
 * @author Touqeer Shah
 * @notice This contract is for creating a Lazy NFT
 * @dev Create MarketPlace for PhramaTrace
 */
contract PTNFT is ERC721URIStorage, EIP712, AccessControl {
    // State variables
    bytes32 private constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // /// @notice Represents an un-minted NFT, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for a real NFT using the redeem function.
    // struct NFTVoucher {
    //     /// @notice The id of the token to be redeemed. Must be unique - if another token with this ID already exists, the redeem function will revert.
    //     uint256 tokenId;
    //     /// @notice The minimum price (in wei) that the NFT creator is willing to accept for the initial sale of this NFT.
    //     uint256 minPrice;
    //     /// @notice The maxmum price (in wei) that the NFT creator is willing to accept for the buy this NFT.
    //     uint256 maxPrice;
    //     /// @notice The metadata URI to associate with this token.
    //     string uri;
    //     /// @notice the EIP-712 signature of all other fields in the NFTVoucher struct. For a voucher to be valid, it must be signed by an account with the MINTER_ROLE.
    //     bytes signature;
    // }

    // Events (we have none!)

    // Modifiers
    modifier onlyMarketPlace() {
        // require(msg.sender == i_owner);
        // require(hasRole(MINTER_ROLE, msg.sender), "PTNFT__ONLYMARKETPLACE");

        if (!hasRole(MINTER_ROLE, msg.sender)) revert PTNFT__ONLYMARKETPLACE();
        _;
    }

    constructor(
        address marketPlace,
        string memory name,
        string memory symbol,
        string memory signingDomain,
        string memory signatureVersion
    ) ERC721(name, symbol) EIP712(signingDomain, signatureVersion) {
        _setupRole(MINTER_ROLE, marketPlace); // this for ristricty only audit contract will call this
    }

    /// @notice Redeems an NFTVoucher for an actual NFT, creating it in the process.
    /// @param redeemer The address of the account which will receive the NFT upon success.
    /// @param voucher A signed NFTVoucher that describes the NFT to be redeemed.
    function redeem(
        address redeemer,
        NFTVoucher calldata voucher /*onlyMarketPlace*/
    ) public payable onlyMarketPlace returns (uint256) {
        // make sure signature is valid and get the address of the signer
        address signer = _verify(voucher);

        // first assign the token to the signer, to establish provenance on-chain
        _safeMint(signer, voucher.tokenId);
        _setTokenURI(voucher.tokenId, voucher.uri);

        // transfer the token to the redeemer
        _safeTransfer(signer, redeemer, voucher.tokenId, "");
        return voucher.tokenId;
    }

    /// @notice Returns a hash of the given NFTVoucher, prepared using EIP712 typed data hashing rules.
    /// @param voucher An NFTVoucher to hash.
    function _hash(NFTVoucher calldata voucher) internal view returns (bytes32) {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "NFTVoucher(uint256 tokenId,uint256 minPrice,uint256 maxPrice,string uri)"
                        ),
                        voucher.tokenId,
                        voucher.minPrice,
                        voucher.maxPrice,
                        keccak256(bytes(voucher.uri))
                    )
                )
            );
    }

    /// @notice Returns the chain id of the current blockchain.
    /// @dev This is used to workaround an issue with ganache returning different values from the on-chain chainid() function and
    ///  the eth_chainId RPC method. See https://github.com/protocol/nft-website/issues/121 for context.
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    /// @notice Verifies the signature for a given NFTVoucher, returning the address of the signer.
    /// @dev Will revert if the signature is invalid. Does not verify that the signer is authorized to mint NFTs.
    /// @param voucher An NFTVoucher describing an unminted NFT.
    function _verify(NFTVoucher calldata voucher) public view onlyMarketPlace returns (address) {
        bytes32 digest = _hash(voucher);
        return ECDSA.recover(digest, voucher.signature);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC721)
        returns (bool)
    {
        return
            ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
}
