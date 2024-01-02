// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC721Token.sol";

/**
 * @title ERC721TokenFactory
 * @dev Factory contract for creating and managing ERC721Token instances.
 */
contract ERC721TokenFactory {
    //Array to store created ERC721Token instances
    ERC721Token[] public erc721TokenArray;
    
    //Counter for the number of created ERC721Token instances
    uint256 public erc721TokenCount;

    event NewERC721Token(address erc721TokenAddress, uint256 index);
    event NewNftMinted(address erc721TokenAddress, address owner, uint256 tokenId);

    /**
     * @dev Creates a new ERC721Token instance.
     * @param name The name of the ERC721 token
     * @param symbol The symbol of the ERC721 token
     * @param baseURI The base URI for token metadata
     * @return The address of the newly created ERC721Token instance.
     */
    function createNewERC721Token(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public returns(address) {
        ERC721Token erc721Token = new ERC721Token(name, symbol, baseURI);
        erc721TokenArray.push(erc721Token);
        erc721TokenCount++;
        emit NewERC721Token(address(erc721Token), erc721TokenArray.length - 1);
        return address(erc721Token);
    }

    /**
     * public functions
     */
    /**
     * @dev Retrieves an array of all created ERC721Token instances.
     * @return An array of ERC721Token instances.
     */
    function getAllERC721Tokens() public view returns (ERC721Token[] memory) {
        return erc721TokenArray;
    }

    /**
     * @dev Calls the ownerOf function on a specified ERC721Token instance.
     * @param token The address of the ERC721Token instance.
     * @param tokenId The ID of the token.
     * @return The address of the owner of the token.
     */
    function callOwnerOf(address token, uint256 tokenId) public view returns (address) {
        return ERC721Token(token).ownerOf(tokenId);
    }

    /**
     * @dev Calls the safeMint function on a specified ERC721Token instance.
     * @param token The address of the ERC721Token instance.
     * @param to The address to which the token will be minted.
     * @param tokenId The ID of the token to be minted.
     * @param uri The URI for the token metadata.
     */
    function callSafeMint(address token, address to, uint256 tokenId, string memory uri) public {
        ERC721Token(token).safeMint(to, tokenId, uri);
        emit NewNftMinted(token, to, tokenId);
    }

    /**
     * @dev Calls the safeTransfer function on a specified ERC721Token instance.
     * @param token The address of the ERC721Token instance.
     * @param from The address from which the token will be transferred.
     * @param to The address to which the token will be transferred.
     * @param tokenId The ID of the token to be transferred.
     */
    function callSafeTransfer(address token, address from, address to, uint256 tokenId) public {
        ERC721Token(token).safeTransfer(from, to, tokenId);
    }

    /**
     * @dev Calls the burn function on a specified ERC721Token instance.
     * @param token The address of the ERC721Token instance.
     * @param from The address from which the token will be burned.
     * @param tokenId The ID of the token to be burned.
     */
    function callBurn(address token, address from, uint256 tokenId) public {
        ERC721Token(token).burn(from, tokenId);
    }

}