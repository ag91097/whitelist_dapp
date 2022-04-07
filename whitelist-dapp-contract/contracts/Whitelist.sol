// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Whitelist {

    // maximum count of addresses allowed for whitelisting. 
    uint public maxAllowedWhitelistAddress;

    // number of addresses whitelisted so far.
    uint public numAddressesWhitelisted;
     
    mapping (address => bool) public whitelistedAddresses;

    constructor(uint _maxAllowedWhitelistAddress) {
        maxAllowedWhitelistAddress = _maxAllowedWhitelistAddress;
    }

    function whitelistAddress() public  {
        require(!whitelistedAddresses[msg.sender], "Address already whitelisted");
        require(numAddressesWhitelisted < maxAllowedWhitelistAddress, "Maximum whitelist limit reached");
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted++;
    }


}