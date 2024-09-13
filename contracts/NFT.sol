// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721URIStorage{
    uint private currentTokenId;
    address public owner;
    constructor() ERC721("MyNewNFT", "MNFT") {
        currentTokenId = 0;
    }

    modifier onlyOwner() {
        owner=msg.sender;
        _;
    }
    function mint(address to, string memory tokenURI) external onlyOwner {
        _safeMint(to, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI); // Setting the token URI
        currentTokenId++;
    }
}
