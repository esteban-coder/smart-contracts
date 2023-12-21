// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC20Token.sol";

contract ERC20TokenFactory {
    ERC20Token[] public erc20TokenArray;
    uint256 public erc20TokenCount;

    event NewERC20Token(address erc20TokenAddress, uint256 index);

    function createNewERC20Token(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) public returns(address) {
        ERC20Token erc20Token = new ERC20Token(name, symbol, initialSupply);
        erc20TokenArray.push(erc20Token);
        erc20TokenCount++;
        emit NewERC20Token(address(erc20Token), erc20TokenArray.length - 1);
        return address(erc20Token);
    }

    /**
     * public functions
     */
    function getAllERC20Tokens() public view returns (ERC20Token[] memory) {
        return erc20TokenArray;
    }

    function callMint(uint256 index, address to, uint256 amount) public {
        ERC20Token(address(erc20TokenArray[index])).mint(to, amount);
    }

    function callBalanceOf(uint256 index, address account) public view returns (uint256) {
        return ERC20Token(address(erc20TokenArray[index])).balanceOf(account);
    }

    //source: https://ethereum.stackexchange.com/questions/103508/is-there-a-way-to-call-a-dynamic-function-name-in-solidity

    function dynamicCall(
        uint256 index,
        bytes calldata _data
    ) public returns (bytes memory) {
        (bool success, bytes memory returnData) = address(
            erc20TokenArray[index]
        ).call(_data);
        require(success);
        return returnData;
    }
}