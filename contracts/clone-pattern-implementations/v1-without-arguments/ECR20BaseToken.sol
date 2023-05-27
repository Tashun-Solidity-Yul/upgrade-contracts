// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "clones-with-immutable-args/Clone.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract ECR20BaseTokenV1 is ERC20Upgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, uint256 initialSupply) external initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
