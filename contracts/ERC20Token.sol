// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;


import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./BaseContract.sol";

contract ERC20Token is ERC20Upgradeable, BaseContract {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, string memory symbol, address ownerAddress, uint256 initialSupply) external initializer {
        __ERC20_init(name, symbol);

        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setRoleAdmin(EXECUTIVE_ROLE, EXECUTIVE_ROLE);
        _setupRole(OWNER_ROLE, ownerAddress);
        _mint(ownerAddress, initialSupply * 10 ** decimals());

    }

    function setupExecutiveRole(address executiveAddress) external onlyRole(OWNER_ROLE) {
        _setupRole(EXECUTIVE_ROLE, executiveAddress);
    }

    function mintExtraTokens(uint256 addingSupply) external onlyRole(EXECUTIVE_ROLE) {
        _mint(msg.sender, addingSupply * 10 ** decimals());
    }

    function transferUserNewlyCreatedTokens(address _address, uint256 amount) external onlyRole(EXECUTIVE_ROLE) {
        _mint(msg.sender, amount * 10 ** decimals());
        _transfer(msg.sender, _address, amount * 10 ** decimals());
    }


}
