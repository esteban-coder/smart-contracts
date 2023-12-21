// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC721Token.sol";

contract ERC721TokenFactory {
    ERC721Token[] public erc721TokenArray;
    uint256 public erc721TokenCount;
    event NewERC721Token(address erc721TokenAddress);
    event NewNftMinted(uint256 contractIndex, address owner, uint256 tokenId);

    function createNewERC721Token(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public returns(address) {
        ERC721Token erc721Token = new ERC721Token(name, symbol, baseURI);
        erc721TokenArray.push(erc721Token);
        erc721TokenCount++;
        emit NewERC721Token(address(erc721Token));
        return address(erc721Token);
    }

    /**
     * public functions
     */
    function getAllERC721Tokens() public view returns (ERC721Token[] memory) {
        return erc721TokenArray;
    }

    function callSafeMint(uint256 _index, address _to, uint256 _tokenId) public {
        ERC721Token(address(erc721TokenArray[_index])).safeMint(_to, _tokenId);
        emit NewNftMinted(_index, _to, _tokenId);
    }

    function callOwnerOf(uint256 _index, uint256 _tokenId) public view returns (address) {
        return ERC721Token(address(erc721TokenArray[_index])).ownerOf(_tokenId);
    }

}