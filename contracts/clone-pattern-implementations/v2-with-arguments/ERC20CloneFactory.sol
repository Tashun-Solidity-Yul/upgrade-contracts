// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./ECR20BaseToken.sol";
 import "clones-with-immutable-args/ClonesWithImmutableArgs.sol";
//import "../CloneWithArgsFunctionTests.sol";

contract ERC20CloneFactoryV2 {
     using ClonesWithImmutableArgs for address;
//    using CloneWithArgsTest for address;
    ECR20BaseTokenV2 immutable implementation;

    event ContractAddress(address);

    constructor(ECR20BaseTokenV2 implementation_) {
        implementation = implementation_;
    }

    function createClone(
        uint256 totalSupply
    ) external returns (ECR20BaseTokenV2 clone) {
        bytes4 selector = 0xfe4b84df;
        bytes memory data = abi.encode(totalSupply);
        clone = ECR20BaseTokenV2(address(implementation).clone(data));
        emit ContractAddress(address(clone));
    }
}
