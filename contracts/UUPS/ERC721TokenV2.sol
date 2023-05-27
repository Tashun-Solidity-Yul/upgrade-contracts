// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "./BaseContractV2.sol";
import "./ERC20TokenV2.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";


contract ERC721TokenV2 is BaseContractV2, ERC721URIStorageUpgradeable {
    mapping(address => uint256) private timeLockMap;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name_, string memory symbol_, address ownerAddress) external initializer {
        __ERC721_init(name_, symbol_);
        __ERC721URIStorage_init();

        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setupRole(OWNER_ROLE, ownerAddress);

        _setRoleAdmin(EXECUTIVE_ROLE, EXECUTIVE_ROLE);
    }

    function setupExecutiveRole(address executiveAddress) external onlyRole(OWNER_ROLE) {
        _setupRole(EXECUTIVE_ROLE, executiveAddress);
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControlUpgradeable, ERC721Upgradeable) returns (bool) {
        return
        interfaceId == type(IAccessControlUpgradeable).interfaceId ||
        interfaceId == type(IERC721Upgradeable).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    function mintNewNFTThroughContract(address receiver) external onlyRole(EXECUTIVE_ROLE) {
        if (timeLockMap[receiver] > block.timestamp) {
            revert ComeBackTomorrow();
        }
        processMint(receiver);

    }

    function processMint(address receiver) private {
        uint256 selectedURIId = getNextToken();
        timeLockMap[receiver] = block.timestamp + secondsForADay;
        incrementTokenId();
        _safeMint(receiver, getTokenId());
        _setTokenURI(getTokenId(), string.concat(uriBaseLocation, StringsUpgradeable.toString(selectedURIId)));
    }


    function getNextToken() private view returns (uint256) {
        return getTokenId() + 1;
    }


}
