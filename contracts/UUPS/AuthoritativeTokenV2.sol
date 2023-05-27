// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./ERC721TokenV2.sol";
import "./ERC20TokenV2.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "hardhat/console.sol";

contract AuthoritativeTokenV2 is IERC721ReceiverUpgradeable, BaseContractV2 {
    ERC721TokenV2 private nftContract;
    ERC20TokenV2 private ftContract;
    mapping(uint256 => address) private originalOwners;
    mapping(uint256 => uint256) private stakedTime;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        ERC721TokenV2 _ERC721TokenV2Address,
        ERC20TokenV2 _ERC20TokenV2Address,
        address ownerAddress
    ) external initializer {
        nftContract = _ERC721TokenV2Address;
        ftContract = _ERC20TokenV2Address;

        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setupRole(OWNER_ROLE, ownerAddress);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {
        originalOwners[tokenId] = from;
        return this.onERC721Received.selector;
    }

    function depositNFT(uint256 tokenId) external {
        stakedTime[tokenId] = block.timestamp;
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function withdrawNFT(uint256 tokenId) external {
        withdrawReward(tokenId);
        stakedTime[tokenId] = 0;
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function mintNFT() external {
        // Check if there is sufficient Amount
        console.log(ftContract.balanceOf(msg.sender));
        if (ftContract.balanceOf(msg.sender) < nftPrice) {
            revert InSufficientFunds();
        }
        ftContract.transferFrom(msg.sender, address(this), nftPrice);
        nftContract.mintNewNFTThroughContract(msg.sender);
    }

    function sellFungibleTokens() external payable {
        // dust is taken by the contract
        uint256 eligibleTokens = msg.value / pricePerOneToken;
        // If authoritative token has enough supply it will transfer
        if (
            ftContract.balanceOf(address(this)) >
            eligibleTokens * 10**ftContract.decimals()
        ) {
            ftContract.transferFrom(msg.sender, address(this), nftPrice);
        } else {
            ftContract.transferUserNewlyCreatedTokens(
                msg.sender,
                eligibleTokens
            );
        }
    }

    function withdrawReward(uint256 tokenId) public {
        if (stakedTime[tokenId] == 0) {
            revert TokenNotDeposited();
        }
        if (originalOwners[tokenId] != msg.sender) {
            revert OwnerInvalid();
        }
        uint256 countToken = stakedTime[tokenId] % secondsForADay;
        stakedTime[tokenId] = stakedTime[tokenId] + secondsForADay * countToken;
        ftContract.transferUserNewlyCreatedTokens(
            msg.sender,
            countToken * rewardPerDay
        );
    }

    function getFundsToOwnersAccount() external onlyRole(OWNER_ROLE) {
        if (address(this).balance > 0) {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    function addFundsToContract() external payable {}
}
