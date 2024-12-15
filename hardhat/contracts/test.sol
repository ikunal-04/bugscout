// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract1 {
    // Critical vulnerability: Publicly exposed mapping with no access control
    mapping(address => uint256) public balances;

    // Medium vulnerability: Hardcoded owner address (bad practice)
    address public owner = 0x1234567890123456789012345678901234567890;

    // Medium vulnerability: Use of tx.origin for authentication
    modifier onlyOwner() {
        require(tx.origin == owner, "Not the owner"); // Vulnerable to phishing attacks
        _;
    }

    // Low vulnerability: Event not emitted after state-changing function
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Critical vulnerability: Reentrancy attack possible
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        
        // Incorrect order: State update happens after the external call
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= _amount;
    }

    // Medium vulnerability: Incorrect use of arithmetic operations
    function transfer(address _to, uint256 _amount) public {
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Overflow/underflow possible in earlier Solidity versions
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    // Low vulnerability: No input validation
    function setOwner(address _newOwner) public onlyOwner {
        owner = _newOwner; // Potentially sets address(0) as the owner
    }

    // Critical vulnerability: Backdoor function
    function backdoorWithdraw() public {
        // Allows withdrawal of all funds by any address (intentionally left unprotected)
        payable(msg.sender).transfer(address(this).balance);
    }

    // Low vulnerability: No way to recover accidentally sent tokens
    fallback() external payable {}

    receive() external payable {}
}
