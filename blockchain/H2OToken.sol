// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract H2OToken {
    string public name = "RainChain H2O";
    string public symbol = "H2O";
    uint8 public decimals = 0;
    uint public totalSupply;

    mapping(address => uint) public balanceOf;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint value);

    constructor() {
        owner = msg.sender;
    }

    function mint(address to, uint amount) public {
        require(msg.sender == owner, "Only owner can mint tokens");
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint amount) public {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }
}
