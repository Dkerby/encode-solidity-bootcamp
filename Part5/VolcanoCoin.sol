//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.3.3/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.3.3/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    event TotalSupply_set(uint indexed);
    mapping(address => Payment[]) public payments;

    struct Payment {
        address recipientAddress;
        uint amount;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 10000);
    }
    
    function getPayments(address _senderAddress) public view returns (Payment[] memory) {
        return payments[_senderAddress];
    }
    
    function changeTotalSupply() public onlyOwner {
        _mint(msg.sender, 1000);
        emit TotalSupply_set(totalSupply() + 1000);
    }
    
    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        super.transfer(_recipient, _amount);
        _createPaymentRecord(msg.sender, _recipient, _amount);
        return true;
    }
    
    function _createPaymentRecord(address _sender, address _recipient, uint256 _amount) private {
        payments[_sender].push(Payment(_recipient, _amount));
    }
}