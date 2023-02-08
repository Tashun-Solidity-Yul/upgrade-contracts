// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "./ERC721Token.sol";
import "./ERC20Token.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";


contract AuthoritativeToken is IERC721ReceiverUpgradeable, BaseContract {
    ERC721Token private nftContract;
    ERC20Token private ftContract;
    mapping(uint256 => address) private originalOwners;
    mapping(uint256 => uint256) private stakedTime;


    function initialize(ERC721Token _ERC721TokenAddress, ERC20Token _ERC20TokenAddress) external initializer {
        nftContract = _ERC721TokenAddress;
        ftContract = _ERC20TokenAddress;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) public override returns (bytes4) {
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
        if (ftContract.balanceOf(msg.sender) < nftPriceWithoutDecimals * 10 ** ftContract.decimals())
        {
            revert InSufficientFunds();
        }
        ftContract.transferFrom(msg.sender, address(this), nftPriceWithoutDecimals * 10 ** ftContract.decimals());
        nftContract.mintNewNFTThroughContract(msg.sender);
    }

    function sellFungibleTokens() external payable {
        // dust is taken by the contract
        uint256 eligibleTokens = msg.value / pricePerOneToken;
        // If authoritative token has enough supply it will transfer
        if (ftContract.balanceOf(address(this)) > eligibleTokens * 10 ** ftContract.decimals())
        {
            ftContract.transferFrom(msg.sender, address(this), nftPriceWithoutDecimals * 10 ** ftContract.decimals());
        }
        else
        {
            ftContract.transferUserNewlyCreatedTokens(msg.sender, eligibleTokens);
        }
    }

    function withdrawReward(uint256 tokenId) public {
        if (stakedTime[tokenId] == 0)
        {
            revert TokenNotDeposited();
        }
        if (originalOwners[tokenId] != msg.sender) {
            revert OwnerInvalid();
        }
        uint256 countToken = stakedTime[tokenId] % secondsForADay;
        stakedTime[tokenId] = stakedTime[tokenId] + secondsForADay * countToken;
        ftContract.transferUserNewlyCreatedTokens(msg.sender, countToken * rewardPerDay);
    }

    function getFundsToOwnersAccount() external onlyOwner {
        if (address(this).balance > 0)
        {
            payable(msg.sender).transfer(address(this).balance);
        }
    }

    function addFundsToContract() external payable {

    }


}
