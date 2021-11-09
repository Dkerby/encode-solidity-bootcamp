//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Score {

    uint score = 0;  
    address owner;
    event Score_set(uint indexed);
    
    // Using the public keyword with a mapping will automatically created a getter function
    // that requires an address (the key type) as an argument
    mapping(address => uint) public score_list;
    
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
    
    // function that returns a user's score
    function getUserScore(address user) public view returns (uint) {
        return score_list[user];
    }


    // gets the value of the 'score' variable
    function getScore() public view returns (uint) {
        return score;
    }
    
    // sets the score in both the 'score' variable and the 'score_list' mapping
    // only the creator of the contract can call this function, therefore the mapping
    // can contain only one key-value pair
    function setScore(uint new_score) public onlyOwner {
        score = new_score;
        score_list[msg.sender] = new_score;
        emit Score_set(new_score);
    }
}