pragma solidity ^0.6.6;

contract BestToken {
    // name
    string public name = "Best token";
    // symbol
    string public symbol = "BST";
    // standard
    string public standard = "Best token v1.0";

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // transfer
    function transfer(address _to, uint256 _amount)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _amount);
        // transfer the balance
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }
}
