// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "./ECR20BaseToken.sol";
// import "clones-with-immutable-args/ClonesWithImmutableArgs.sol";
//import "../CloneWithArgsFunctionTests.sol";
import "../OpenZeppelinCloneTest.sol";

contract ERC20CloneFactory {
    using OpenZeppelinCloneTest for address;
    // using ClonesWithImmutableArgs for address;
    //    using CloneWithArgsTest for address;
    ECR20BaseTokenV1 immutable implementation;

    event ContractAddress(address);

    constructor(ECR20BaseTokenV1 implementation_) {
        implementation = implementation_;
    }

    function createClone() external returns (ECR20BaseTokenV1 clone) {
        clone = ECR20BaseTokenV1(address(implementation).clone());
        emit ContractAddress(address(clone));
    }
}
