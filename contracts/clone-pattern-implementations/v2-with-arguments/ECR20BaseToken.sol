// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "clones-with-immutable-args/Clone.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";


//contract ECR20BaseTokenV2 is ERC20Token {
contract ECR20BaseTokenV2 is ERC20Upgradeable {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol) external initializer {
        __ERC20_init(name, symbol);
    }



    function getConstantSupply() public pure returns (uint256) {
        return _getArgUint256(0);
    }

    /// @return offset The offset of the packed immutable args in calldata
    function _getImmutableArgsOffset() internal pure returns (uint256 offset) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            offset := sub(
            calldatasize(),
            add(shr(240, calldataload(sub(calldatasize(), 2))), 2)
            )
        }
    }
//
    /// @notice Reads an immutable arg with type uint256
    /// @param argOffset The offset of the arg in the packed data
    /// @return arg The arg value
    function _getArgUint256(uint256 argOffset)
    internal
    pure
    returns (uint256 arg)
    {
        uint256 offset = _getImmutableArgsOffset();
        // solhint-disable-next-line no-inline-assembly
        assembly {
            arg := calldataload(add(offset, argOffset))
        }
    }


}
