// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("MedicalRecord", "MDRD") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

   function safeMint(address to, string memory ipfsCid, bytes32 dataHash) public {
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    _setTokenMetadata(tokenId, ipfsCid, dataHash);
}

event MedicalRecordMinted(uint256 tokenId, address indexed owner, string ipfsCid, bytes32 dataHash);

function _setTokenMetadata(uint256 tokenId, string memory ipfsCid, bytes32 dataHash) internal {
    _setTokenURI(tokenId, ipfsCid);
    emit MedicalRecordMinted(tokenId, ownerOf(tokenId), ipfsCid, dataHash);
}


}


