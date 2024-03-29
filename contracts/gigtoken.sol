// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GIGToken is ERC20, ERC20Burnable {
    constructor() ERC20("GIG Token", "GIG") {
        _mint(address(this), 10000000 * (10 ** uint256(decimals()))); // Mint 10 million tokens to this contract
    }

    function sendTokens(address to, uint256 amount) public {
        require(balanceOf(address(this)) >= amount, "Insufficient tokens in the contract");
        _transfer(address(this), to, amount);
    }
}