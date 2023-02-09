// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./BaseContract.sol";
import "./ERC20Token.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";


contract ERC721Token is BaseContract, ERC721URIStorageUpgradeable, UUPSUpgradeable {
    mapping(address => uint256) private timeLockMap;

    function initialize(string memory name_, string memory symbol_) external initializer {
        __ERC721_init(name_,symbol_);
         __ERC721URIStorage_init();
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
        return
        interfaceId == type(IAccessControlUpgradeable).interfaceId ||
        interfaceId == type(IERC721Upgradeable).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    function mintNewNFTThroughContract(address receiver) external onlyRole(ADMIN_ROLE) {
        if (timeLockMap[receiver] > block.timestamp) {
            revert ComeBackTomorrow();
        }
        processMint(receiver);

    }

    function processMint(address receiver) private {
        uint256 selectedURIId = getRandomUint256(getTokenId()) % uniqueTokenCount;
        timeLockMap[receiver] = block.timestamp + secondsForADay;
        incrementTokenId();
        _setTokenURI(getTokenId(), string(abi.encodePacked(uriBaseLocation, StringsUpgradeable.toString(selectedURIId))));
        _safeMint(receiver, getTokenId());
    }


    function getRandomUint256(uint256 input) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, input)));
    }

    function _authorizeUpgrade(address newImplementation) internal virtual override {
//        require("");
    }

}
