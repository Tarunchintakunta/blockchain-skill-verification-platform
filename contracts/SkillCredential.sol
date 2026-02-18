// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SkillCredential
 * @dev NFT-based skill credential system on Polygon.
 *      Institutions issue credentials as NFTs; credentials can be verified
 *      and revoked on-chain. Integrates with AI assessment and ML job matching.
 */
contract SkillCredential is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    uint256 private _nextTokenId;

    struct Credential {
        address holder;
        address issuer;
        string credentialHash;
        uint256 issuedAt;
        bool isValid;
    }

    mapping(uint256 => Credential) private _credentials;
    mapping(address => uint256[]) private _holderCredentials;
    mapping(address => uint256[]) private _issuerCredentials;

    event CredentialIssued(
        uint256 indexed tokenId,
        address indexed holder,
        address indexed issuer,
        string credentialHash
    );

    event CredentialRevoked(uint256 indexed tokenId);

    constructor() ERC721("SkillCredential", "SKLC") {
