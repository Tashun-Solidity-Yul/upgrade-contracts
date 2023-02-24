// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./ECR20BaseToken.sol";
// import "clones-with-immutable-args/ClonesWithImmutableArgs.sol";
import "./CloneWithArgsFunctionTests.sol";

contract ERC20CloneFactory {
    // using ClonesWithImmutableArgs for address;
    using CloneWithArgsTest for address;
    ECR20BaseTokenV1 immutable implementation;

    event ContractAddress(address);

    constructor(ECR20BaseTokenV1 implementation_) {
        implementation = implementation_;
    }

//    function createClone(
//        string memory name,
//        string memory symbol,
//        uint256 totalSupply
//    ) external returns (ECR20BaseToken clone) {
//        bytes memory data = abi.encodePacked(name, symbol, totalSupply);
//        clone = ECR20BaseToken(address(implementation).clone(data));
//        emit ContractAddress(address(clone));
//    }

    function createClone(
        uint256 totalSupply
    ) external returns (ECR20BaseTokenV1 clone) {
        bytes memory data = abi.encodePacked(totalSupply);
        clone = ECR20BaseToken(address(implementation).clone(data));
        emit ContractAddress(address(clone));
    }
}
