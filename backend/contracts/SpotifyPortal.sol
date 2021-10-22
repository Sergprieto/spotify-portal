// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract SpotifyPortal {
    uint256 totalSongs;

    event newSong(address indexed from, uint256 timestamp, string submittedBy, string url);

    struct Song {
        address addr;
        uint256 timestamp;
        string submittedBy;
        string url;
    }
    Song[] songs;

    mapping(address => uint256) public mostRecentSender;

    constructor() payable {
        console.log("Construction complete!");
    }

    function addSong(string memory _submittedBy, string memory _url) public {
        require(
            mostRecentSender[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        mostRecentSender[msg.sender] = block.timestamp;

        totalSongs += 1;
        console.log("%s at %s account sent us a song at %s url!", _submittedBy, msg.sender, _url);
        songs.push(Song(msg.sender, block.timestamp, _submittedBy, _url));
        emit newSong(msg.sender, block.timestamp, _submittedBy, _url);

    }

    function getAllSongs() public view returns (Song[] memory) {
        return songs;
    }

    function getTotalSongs() public view returns (uint256) {
        return totalSongs;
    }
}
