//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract VolcanoToken is ERC721 {
    uint256 tokenId = 1;
    mapping(address => Metadata[]) metadata;

    struct Metadata {
        uint256 timestamp;
        uint256 tokenId;
        string tokenURI;
    }

    constructor() ERC721("VolcanoToken", "VOL") {}

    function mintToken() public {
        super._safeMint(msg.sender, tokenId);
        Metadata memory newTokenData = Metadata(block.timestamp, tokenId, "https://ipfs.io/ipfs/QmceHjRwzGYtXweUtnBkU5sYssUsTaCHf5s8fgwFLDRoYJ");
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

    function getTokenMetadata(address _account) public view returns (Metadata[] memory) {
        return metadata[_account];
    }
}

