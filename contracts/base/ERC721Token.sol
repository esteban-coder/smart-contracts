// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

/**
 * @title ERC721Token
 * @dev Extends ERC721 standard with additional features.
 */
contract ERC721Token is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, AccessControl, ERC721Burnable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public baseURI;

    /**
     * @dev Contract constructor
     * @param name The name of the ERC721 token
     * @param symbol The symbol of the ERC721 token
     * @param newBaseURI The base URI for token metadata
     */
    constructor(string memory name, string memory symbol, string memory newBaseURI) 
        ERC721(name, symbol) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        baseURI = newBaseURI;
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
     * @dev Safely mints a new token with a specified URI.
     * Can only be called by an address with the MINTER_ROLE.
     * @param to The address to which the token will be minted
     * @param tokenId The ID of the newly minted token
     * @param uri The URI for the token metadata
     */
    function safeMint(address to, uint256 tokenId, string memory uri) public onlyRole(MINTER_ROLE){
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Internal function to get the base URI for token metadata.
     * @return The base URI for token metadata.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Safely transfers a specified ERC721 token from one address to another.
     * Can only be called by an address with the DEFAULT_ADMIN_ROLE.
     * @param from The address from which the token will be transferred.
     * @param to The address to which the token will be transferred.
     * @param tokenId The ID of the token to be transferred.
     */
    function safeTransfer(address from, address to, uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE){
        _safeTransfer(from, to, tokenId);
    }

    /**
     * @dev Burns a specific ERC721 token.
     * Can only be called by an address with the DEFAULT_ADMIN_ROLE.
     * @param from The address from which the token will be burned
     * @param tokenId The ID of the token to be burned
     */
    function burn(address from, uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE){
        _update(address(0), tokenId, from);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
