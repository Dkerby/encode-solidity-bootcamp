// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract GasContract {

    uint public totalSupply; // cannot be updated
    uint paymentCounter;
    address [5] public administrators;
    address contractOwner;

    mapping(address => uint256) balances;
    mapping(address => Payment[]) payments;

    enum PaymentType { BasicPayment, Refund, Dividend, GroupPayment }

    struct Payment {
      uint paymentID;
      uint amount;
      address recipient;
      PaymentType paymentType;
      bool adminUpdated;
    }

    event Transfer(address recipient, uint256 amount);

    modifier onlyOwner() {
        require(contractOwner == msg.sender, "caller is not the owner");
        _;
    }

    constructor(address[] memory _admins, uint256 _totalSupply) {
      contractOwner  = msg.sender;
      totalSupply = _totalSupply;
      
      for (uint8 ii = 0;ii<administrators.length ;ii++){
        administrators[ii] = _admins[ii];
        if(_admins[ii]==msg.sender){
            balances[msg.sender] = totalSupply;
        }
      }    
    }

    function transfer(address _recipient, uint _amount, string calldata _name) public returns (bool) {
      require(balances[msg.sender] >= _amount,"Sender has insufficient Balance");
      balances[msg.sender] -= _amount;
      balances[_recipient] += _amount;
      payments[msg.sender].push(Payment(++paymentCounter, _amount, _recipient, PaymentType.BasicPayment, false));
      emit Transfer(_recipient, _amount);
      return true;
   }

    function updatePayment(address _user, uint _ID, uint _amount,PaymentType _type ) public onlyOwner {
        for (uint256 ii=0;ii<payments[_user].length;ii++){
            if(payments[_user][ii].paymentID==_ID){
               payments[_user][ii].adminUpdated = true; 
               payments[_user][ii].paymentType = _type;
               payments[_user][ii].amount = _amount;
            }
        }
    }
   
    function balanceOf(address _user) external view returns (uint balance_){
        return balances[_user];
    }

    function getPayments(address _user) external view returns (Payment[] memory payments_) {
        return payments[_user];
    }

    function getTradingMode() public pure returns (bool){
        return true;
    }
}