// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../base/ERC20Token.sol";

/**
 * @title ERC20TokenFactory
 * @dev Factory contract for creating and managing ERC20Token instances.
 */
contract ERC20TokenFactory {
    //Array to store created ERC20Token instances
    ERC20Token[] public erc20TokenArray;
    //Counter for the number of created ERC20Token instances
    uint256 public erc20TokenCount;

    event NewERC20Token(address erc20TokenAddress, uint256 index);

    /**
     * @dev Creates a new ERC20Token instance.
     * @param name The name of the ERC20 token
     * @param symbol The symbol of the ERC20 token
     * @param initialSupply The initial supply of the ERC20 token
     * @return The address of the newly created ERC20Token instance.
     */
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

    
    /**
     * @dev Retrieves an array of all created ERC20Token instances.
     * @return An array of ERC20Token instances.
     */
    function getAllERC20Tokens() public view returns (ERC20Token[] memory) {
        return erc20TokenArray;
    }

    /**
     * @dev Calls the balanceOf function on a specified ERC20Token instance.
     * @param token The address of the ERC20Token instance.
     * @param account The address for which the balance is queried.
     * @return The balance of the specified account.
     */
    function callBalanceOf(address token, address account) public view returns (uint256) {
        return ERC20Token(token).balanceOf(account);
    }

    /**
     * @dev Calls the mint function on a specified ERC20Token instance.
     * @param token The address of the ERC20Token instance.
     * @param to The address to which new tokens will be minted.
     * @param amount The amount of tokens to be minted.
     */
    function callMint(address token, address to, uint256 amount) public {
        ERC20Token(token).mint(to, amount);
    }

    /**
     * @dev Calls the transfer function on a specified ERC20Token instance from the factory.
     * @param token The address of the ERC20Token instance.
     * @param to The address to which tokens will be transferred.
     * @param value The amount of tokens to be transferred.
     * @return A boolean indicating whether the transfer was successful.
     */
    function callTransferFromFactory(address token, address to, uint256 value) public returns (bool){
        return ERC20Token(token).transfer(to, value);
    }

    /**
     * @dev Calls the transfer function on a specified ERC20Token instance.
     * @param token The address of the ERC20Token instance.
     * @param to The address to which tokens will be transferred.
     * @param value The amount of tokens to be transferred.
     * @return A boolean indicating whether the transfer was successful.
     */
    function callTransfer(address token, address from, address to, uint256 value) public returns (bool){
        return ERC20Token(token).transfer(from, to, value);
    }

    //source: https://ethereum.stackexchange.com/questions/103508/is-there-a-way-to-call-a-dynamic-function-name-in-solidity
    /**
     * @dev Calls a dynamic function on a specified ERC20Token instance.
     * @param index The index of the ERC20Token instance in the array.
     * @param _data The data to be passed to the dynamic function call.
     * @return The return data from the dynamic function call.
     */
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