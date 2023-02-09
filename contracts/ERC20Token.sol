// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;


import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./BaseContract.sol";

contract ERC20Token is ERC20Upgradeable, BaseContract {
    function initialize(string memory name, string memory symbol, uint256 initialSupply) external initializer {
        _mint(address(this), initialSupply * 10 ** decimals());
    }

    function mintExtraTokens(uint256 addingSupply) external onlyRole(ADMIN_ROLE) {
        _mint(msg.sender, addingSupply * 10 ** decimals());
    }

    function transferUserNewlyCreatedTokens(address _address, uint256 amount) external onlyRole(ADMIN_ROLE) {
        _mint(msg.sender, amount * 10 ** decimals());
        _transfer(msg.sender, _address, amount * 10 ** decimals());
    }


}
