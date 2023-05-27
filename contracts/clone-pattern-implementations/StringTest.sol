// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract StringTest {
    constructor(){

    }

    function stringSizeTest(string calldata a) external {
//        console.log(a);
        //        console.log(a.length);
        bytes32 pointer;
        bytes32 newPointer;
        bytes32 val;
        bytes32 size;
        assembly{
            size:= calldatasize()
            pointer := calldataload(4)
            newPointer := mload(add(36, pointer))
            val := calldataload(sub(size, pointer))
        //            newPointer:= mload(0xa0)
        //            if gt(size, 256) {
        //                revert(0,0)
        //            }
        }
        console.logBytes32(size);
        console.logBytes32(pointer);
        console.logBytes32(newPointer);
        console.log(string(abi.encode(val)));
    }

    //    function stringSizeTest(string memory a) external {
    //        //        console.log(a);
    //        //        console.log(a.length);
    //        bytes32 pointer;
    //        bytes32 newPointer;
    //        bytes32 size;
    //        assembly{
    //            size:= mload(a)
    //            pointer:= a
    //        //            newPointer:= mload(add(size,pointer))
    //            newPointer:= mload(0xa0)
    //            if gt(size, 256) {
    //                revert(0,0)
    //            }
    //        }
    //        console.logBytes32(size);
    //        console.logBytes32(pointer);
    //        console.logBytes32(newPointer);
    //        console.log(string(abi.encode(newPointer)));
    //    }
}
