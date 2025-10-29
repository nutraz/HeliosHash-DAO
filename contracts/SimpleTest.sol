// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleTest {
    uint256 public value;

    constructor(uint256 _value) {
        value = _value;
    }

    function setValue(uint256 _value) external {
        value = _value;
    }

    function getValue() external view returns (uint256) {
        return value;
    }
}
