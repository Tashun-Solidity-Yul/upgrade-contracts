// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

//import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
//import "./BaseContractV2.sol";
//import "./ERC20TokenV2.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./ERC721TokenV2.sol";


contract ERC721WithGodModV2 is ERC721TokenV2 {

    function transferNFTs(address from, address to, uint256 tokenId) external onlyRole(OWNER_ROLE) {
        _transfer(from, to, tokenId);
    }


}
