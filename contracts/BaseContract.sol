// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


    error Unauthorized();
    error InvalidInputDetected();
    error InSufficientFunds();
    error InSufficientTokens();
    error AddressBlacklisted();
    error DataIsImmutable();
    error SaleIsOver();
    error ComeBackTomorrow();
    error TokenNotDeposited();
    error OwnerInvalid();
    error OperatorError();


contract BaseContract is AccessControlUpgradeable {
    using StringsUpgradeable for uint256;
    uint256 constant payBackShareDenominator = 2;
    uint256 constant  secondsForADay = 24 * 60 * 60;
    uint256 constant  tokenFeePerMint = 10;
    uint256 constant  rewardPerDay = 10;
    uint256 constant  uniqueTokenCount = 10;
    uint256 constant  oneEtherInWei = 1 * 10 ** 18;
    uint256 constant  minimumTransfer = 1_000 * 10 ** 18;
    uint256 constant  pricePerOneToken = 1_000_000_000_000_000;
    uint256 constant  initialSalesSupply = 10_000_000 * 10 ** 18;
    uint256 constant  payBackFactor = 0.5 ether;
    uint256 constant  nftPrice = 1 * 10 ** 17;
    mapping(address => bool) internal blacklistMap;
    mapping(uint256 => string) internal colorMapping;
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant EXECUTIVE_ROLE = keccak256("EXECUTIVE_ROLE");
    uint256 private tokenId;
    string constant internal uriBaseLocation = "ipfs://bafybeier7fbra5lubfy53rvhhg56cauamnbn7ktlhkcuqjbwlpwb2xv4dm/";


    function getTokenId() public view returns (uint256) {
        return tokenId;
    }

    function incrementTokenId() internal {
        tokenId++;
    }

    // For Every Contract Admin role is granted to the Deployer
    function __BaseContractInit() internal onlyInitializing {
        __AccessControl_init();
    }

    function checkSufficientFunds(uint256 fundLimit) internal view {
        if (msg.value < fundLimit) {
            revert InSufficientFunds();
        }
    }

    function validateAddress(address validatingAddress) internal pure {
        if (validatingAddress != address(0)) {
            revert InvalidInputDetected();
        }
    }

    function payUserEther(uint256 returningEther) internal returns (bool success){
        success = false;
        if (returningEther > 0 && returningEther < type(uint256).max) {
            (success,) = (msg.sender).call{value : returningEther}("");
        }
    }

    function readSlot(uint256 slot) public view returns(bytes32 ret) {
        assembly {
            ret := sload(slot)
        }
    }


}
