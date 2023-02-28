// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

//import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
//import "./BaseContract.sol";
//import "./ERC20Token.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./ERC721Token.sol";


contract ERC721WithGodMod is ERC721Token {

    function transferNFTs(address from, address to, uint256 tokenId) external onlyRole(OWNER_ROLE) {
        _transfer(from, to, tokenId);
    }


}
