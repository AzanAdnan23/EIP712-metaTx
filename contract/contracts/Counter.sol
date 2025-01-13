// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract Counter {
    // Mapping to track the counter for each address
    mapping(address => uint256) public counters;

    // Function to increment the counter for the sender
    function increment() public {
        counters[msg.sender]++;  
    }

    // Function to get the counter for a specific address (optional)
    function getCounter(address _address) public view returns (uint256) {
        return counters[_address];
    }
}
