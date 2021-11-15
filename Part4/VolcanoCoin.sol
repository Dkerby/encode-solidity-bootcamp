//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint totalSupply = 10000;  
    address owner;
    event TotalSupply_set(uint indexed);
    event Transfer(address recipient, uint amount);
    mapping(address => uint) balance;
    mapping(address => Payment[]) payments;

    struct Payment {
        address recipientAddress;
        uint amount;
    }
    
    // set the owner of the contract to the address of the contract creator
    constructor() {
        owner = msg.sender;
        balance[owner] = totalSupply;
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

    function getTokenBalance(address _userAddress) public view returns (uint) {
        return balance[_userAddress];
    }

    function getPayments(address _senderAddress) public view returns (Payment[] memory) {
        return payments[_senderAddress];
    }

    // increment coin total supply by 1000
    function increaseTotalSupply() public onlyOwner {
        totalSupply = totalSupply + 1000;
        balance[msg.sender] += 1000;
        emit TotalSupply_set(totalSupply);
    }

    // transfer tokens from one address to another
    function transfer(address _recipient, uint256 _amount) public {
        require(balance[msg.sender] >= _amount, "Sender does not have enough tokens to complete the transfer.");

        balance[msg.sender] -= _amount;
        balance[_recipient] += _amount;
        payments[msg.sender].push(Payment(_recipient, _amount));

        emit Transfer(_recipient, _amount);
    }
}