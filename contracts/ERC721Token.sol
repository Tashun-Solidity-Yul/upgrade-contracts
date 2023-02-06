// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./BaseContract.sol";
import "./ERC20Token.sol";


contract ERC721Token is BaseContract, ERC721URIStorageUpgradeable {
    mapping(address => uint256) private timeLockMap;

    function initialize(string memory name_, string memory symbol_) {
        __ERC721_init(name_,symbol_);
         __ERC721URIStorage_init();
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControl, ERC721) returns (bool) {
        return
        interfaceId == type(IAccessControl).interfaceId ||
        interfaceId == type(IERC721).interfaceId ||
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
        _setTokenURI(getTokenId(), string(abi.encodePacked(uriBaseLocation, Strings.toString(selectedURIId))));
        _safeMint(receiver, getTokenId());
    }


    function getRandomUint256(uint256 input) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, input)));
    }

}
