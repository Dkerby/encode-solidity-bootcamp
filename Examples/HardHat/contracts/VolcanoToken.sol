//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoToken is ERC721, Ownable {
    uint256 tokenId = 1;
    mapping(address => Metadata[]) public metadata;

    struct Metadata {
        uint256 timestamp;
        uint256 tokenId;
        string tokenURI;
    }

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mintToken() public {
        super._safeMint(msg.sender, tokenId);
        Metadata memory newTokenData = Metadata(block.timestamp, tokenId, "Insert future token URI here");
        metadata[msg.sender].push(newTokenData);
        tokenId++;
    }

    function burnToken(uint256 _tokenId) public {
        require(super.ownerOf(_tokenId) == msg.sender);
        super._burn(_tokenId);
        _removeTokenHistory(_tokenId);
    }

    function _removeTokenHistory(uint256 _tokenId) internal {
        Metadata[] memory userTokens = metadata[msg.sender];
        delete metadata[msg.sender];

        for (uint i=0; i < userTokens.length; i++) { 
            if(userTokens[i].tokenId != _tokenId)
            {
                metadata[msg.sender].push(userTokens[i]);
            }
        }
    }

    function _getTokenURI(uint256 _tokenId) internal view returns (string memory) {
        Metadata[] memory userTokens = metadata[msg.sender];

        for (uint i=0; i < userTokens.length; i++) { 
            if(userTokens[i].tokenId == _tokenId)
            {
                return userTokens[i].tokenURI;
            }
        }

        revert("Token ID not found");
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return _getTokenURI(_tokenId);
    }
}