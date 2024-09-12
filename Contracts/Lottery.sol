// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Lottery {
    address public manager;
    address payable[] public arr;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        arr.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, arr)
                )
            );
    }

    function winner() public restriction {
        require(msg.sender == manager);
        uint ind = random() % arr.length;
        arr[ind].transfer(address(this).balance);
        arr = new address payable[](0);
    }

    modifier restriction() {
        require(msg.sender == manager);
        _;
    }

    function getplayers() public view returns (address payable[] memory) {
        return arr;
    }
}
