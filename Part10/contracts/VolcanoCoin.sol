// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC"), Ownable {

    uint256  constant initialSupply = 100000;
    uint256 paymentId = 1;

    enum PaymentType { UNKNOWN, BASIC_PAYMENT, REFUND, DIVIDEND, GROUP_PAYMENT }

    struct Payment{
        uint identifier;
        uint amount;
        address recipient;
        PaymentType paymentType;
        uint timestamp;
        string comment;
    }

    mapping (address => Payment[]) public payments;
    event supplyChanged(uint256);

    constructor() {
        _mint(msg.sender, initialSupply);
    }

    function transfer(address _recipient, uint _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        addPaymentRecord(msg.sender, _recipient, _amount);
        paymentId++;
        return true;
    }

    function addPaymentRecord(address _sender, address _recipient, uint _amount) internal {
        const payment = Payment(paymentId, _amount,_recipient,  paymentType.UNKNOWN, block.timestamp, "");
        payments[_sender].push(payment);
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }
}