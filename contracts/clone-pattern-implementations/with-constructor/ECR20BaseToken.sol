// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "clones-with-immutable-args/Clone.sol";
import "hardhat/console.sol";
import "../../ERC20Token.sol";

contract ECR20BaseTokenV2 is ERC20Token {
//    constructor(
//        string memory name,
//        string memory symbol,
//        uint256 supply
//    ) ERC20("name", "LL") {
//        _mint(msg.sender, supply);
//    }
//    constructor(
//        uint256 supply
//    ) ERC20("name", "LL") {
//        _mint(msg.sender, supply);
//    }

//    function mintTokens(uint256 amount) public {
//        _mint(msg.sender, amount);
//        console.log("HERE");
//    }


//    function param1() public pure returns (string memory ret) {
//        uint256 offset = _getImmutableArgsOffset();
//
//        bytes32 pointer;
//        bytes32 newPointer;
//        bytes32 val;
//        bytes32 size;
//        assembly{
//            size:= calldatasize()
//            pointer := calldataload(4)
//            newPointer := mload(add(36, pointer))
//            val := calldataload(sub(size, pointer))
//
//        }
//
//        assembly {
//            ret := calldataload(add(newPointer, 0))
//        }
//        bytes32 a;
//        assembly {
//            a :=calldataload(0)
//
//        }
//        return "hi";
//    }

//    function param2() public pure returns (string memory) {
//        bytes32 a;
//        assembly {
//            a :=calldataload(0)
//
//        }
//        return string(abi.encode(a));
//    }

    function param3() public pure returns (uint256) {
        return 123;
    }
//
//    /// @return offset The offset of the packed immutable args in calldata
//    function _getImmutableArgsOffset() internal pure returns (uint256 offset) {
//        // solhint-disable-next-line no-inline-assembly
//        assembly {
//            offset := sub(
//            calldatasize(),
//            add(shr(240, calldataload(sub(calldatasize(), 2))), 2)
//            )
//        }
//    }


}
