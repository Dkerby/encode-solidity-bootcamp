//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply = 10000;  
    address owner;
    event TotalSupply_set(uint indexed);
    
    // set the owner of the contract to the address of the contract creator
    constructor() {
        owner = msg.sender;
    }
    
    // using a modifier to make sure only the owner can use the set method
    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }
    
    function getTotalSupply() public view returns (uint) {
        return totalSupply;
    }

    // increment coin total supply by 1000
    function increaseTotalSupply() public onlyOwner {
        totalSupply = totalSupply + 1000;
        emit TotalSupply_set(totalSupply);
    }
}