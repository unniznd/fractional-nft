// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract FractionalToken is ERC20{
    constructor() ERC20("FractionalToken", "FRC") {}

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }
}
