// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC721Token.sol";

contract FactoryERC721Token {
    ERC721[] public ERC721Array;
    uint256 public amountOfContracts;
    event NewContract(address contractAddress);
    event NewNftMinted(uint256 contractIndex, address owner, uint256 tokenId);

    function createNewContract(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public {
        ERC721Token newERC721 = new ERC721Token(name, symbol,baseURI);
        ERC721Array.push(newERC721);
        amountOfContracts++;
        emit NewContract(address(newERC721));
    }

    function factoryMinter(
        uint256 _contractIndex,
        address _to,
        uint256 _tokenId
    ) public {
        ERC721Token(address(ERC721Array[_contractIndex])).safeMint(
            _to,
            _tokenId
        );
        emit NewNftMinted(_contractIndex, _to, _tokenId);
    }

    function factoryOwnerOf(
        uint256 _contractIndex,
        uint256 _tokenId
    ) public view returns (address) {
        return
            ERC721Token(address(ERC721Array[_contractIndex])).ownerOf(_tokenId);
    }
}
