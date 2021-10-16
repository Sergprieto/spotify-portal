// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract WavePortal {
  uint totalWaves;
  uint private seed;

  event NewWave(address indexed from, uint timestamp, string message);
  event winnerWinner(address indexed from, uint timestamp);

  struct Wave {
    address waver;
    string message;
    uint timestamp;
  }
   Wave[] waves;

   mapping(address => uint) public lastWavedAt;

  constructor() payable {
    console.log("Construction complete!");
  }

  function wave(string memory _message) public {
    require(lastWavedAt[msg.sender] + 1 minutes < block.timestamp, "Wait 15m");

    lastWavedAt[msg.sender] = block.timestamp;

    totalWaves += 1;
    console.log("%s is waved!", msg.sender);
    waves.push(Wave(msg.sender, _message, block.timestamp));
    emit NewWave(msg.sender, block.timestamp, _message);

    uint randomNumber = (block.difficulty + block.timestamp + seed) % 100;
    console.log("Random number generated: %s", randomNumber);

    seed = randomNumber;

    if(randomNumber < 50) {
      console.log("%s won!", msg.sender);
      uint prizeAmount = 0.000001 ether;
      require (prizeAmount <= address(this).balance, "Trying to withdraw more money than the contract has!");
      (bool success,) = (msg.sender).call{value: prizeAmount}("");
      require(success, "Failed, to withdraw money from the contract");
      emit winnerWinner(msg.sender, block.timestamp);
    }
  }

  function getAllWaves() view public returns (Wave[] memory) {
    return waves;
  }

  function getTotalWaves() view public returns (uint) {
    return totalWaves;
  }
}