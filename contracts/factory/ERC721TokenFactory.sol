// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC721Token.sol";

contract ERC721TokenFactory {
    ERC721Token[] public erc721TokenArray;
    uint256 public erc721TokenCount;

    event NewERC721Token(address erc721TokenAddress, uint256 index);
    event NewNftMinted(address erc721TokenAddress, address owner, uint256 tokenId);

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
    function getAllERC721Tokens() public view returns (ERC721Token[] memory) {
        return erc721TokenArray;
    }

    function callOwnerOf(address token, uint256 tokenId) public view returns (address) {
        return ERC721Token(token).ownerOf(tokenId);
    }

    function callSafeMint(address token, address to, uint256 tokenId, string memory uri) public {
        ERC721Token(token).safeMint(to, tokenId, uri);
        emit NewNftMinted(token, to, tokenId);
    }

    function callSafeTransfer(address token, address from, address to, uint256 tokenId) public {
        ERC721Token(token).safeTransfer(from, to, tokenId);
    }

    function callBurn(address token, address from, uint256 tokenId) public {
        ERC721Token(token).burn(from, tokenId);
    }

}