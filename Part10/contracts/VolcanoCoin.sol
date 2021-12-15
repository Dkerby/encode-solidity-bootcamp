// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VolcanoCoin is ERC20("Volcano Coin", "VLC") {
    uint256 constant initialSupply = 100000;
    uint256 paymentId = 1;
    address owner;
    mapping (address => Payment[]) public payments;

    enum PaymentType { UNKNOWN, BASIC_PAYMENT, REFUND, DIVIDEND, GROUP_PAYMENT }

    struct Payment{
        uint id;
        uint amount;
        address recipient;
        PaymentType paymentType;
        uint timestamp;
        string comment;
    }

    event supplyChanged(uint256);

    constructor() {
        _mint(msg.sender, initialSupply);
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender == owner) {
            _;
        }
    }

    function transfer(address _recipient, uint _amount) public virtual override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        _addPaymentRecord(msg.sender, _recipient, _amount);
        paymentId++;
        return true;
    }

    function _addPaymentRecord(address _sender, address _recipient, uint _amount) internal {
        Payment memory payment = Payment(paymentId, _amount,_recipient, PaymentType.UNKNOWN, block.timestamp, "");
        payments[_sender].push(payment);
    }

    function addToTotalSupply(uint256 _quantity) public onlyOwner {
        _mint(msg.sender,_quantity);
        emit supplyChanged(_quantity);
    }

    function getPayments(address _user) public view returns (Payment[] memory) {
        return payments[_user];
    }

    function updatePaymentInfo(uint _paymentId, uint8 _paymentType, string calldata _comment) public {
        require(payments[msg.sender].length > 0, "You haven't sent any payments yet.");
        require(_paymentType <= uint8(PaymentType.GROUP_PAYMENT), "Payment type not found.");
        for(uint i = 0;i < payments[msg.sender].length;i++) {
            if(payments[msg.sender][i].id == _paymentId) {
                payments[msg.sender][i].paymentType = PaymentType(_paymentType);
                payments[msg.sender][i].comment = _comment;
            }
        }
    }

    function updatePaymentType(uint _paymentId, uint8 _paymentType, address _userAddress) public onlyOwner {
        require(payments[_userAddress].length > 0, "Could not find payments for user address");
        require(_paymentType <= uint8(PaymentType.GROUP_PAYMENT), "Payment type not found.");
        for(uint i = 0;i < payments[_userAddress].length;i++) {
            if(payments[_userAddress][i].id == _paymentId) {
                payments[_userAddress][i].paymentType = PaymentType(_paymentType);
                string memory addressAsString = bytes32ToString(bytes32(abi.encodePacked(msg.sender)));
                payments[_userAddress][i].comment = string(abi.encodePacked(payments[_userAddress][i].comment, " - updated by: ", addressAsString));
            }
        }
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        bytes memory bytesArray = new bytes(40);
        for (i = 0; i < bytesArray.length; i++) {
            uint8 _f = uint8(_bytes32[i/2] >> 4);
            uint8 _l = uint8(_bytes32[i/2] & 0x0f);

            bytesArray[i] = toByte(_f);
            i = i + 1;
            bytesArray[i] = toByte(_l);
        }
        return string(abi.encodePacked("0x", bytesArray));
    }

    function toByte(uint8 _uint8) public pure returns (bytes1) {
        if(_uint8 < 10) {
            return bytes1(_uint8 + 48);
        } else if (_uint8 < 12) {
            return bytes1(_uint8 + 87 - 32);
        } else {
            return bytes1(_uint8 + 87);
        }
    }
}