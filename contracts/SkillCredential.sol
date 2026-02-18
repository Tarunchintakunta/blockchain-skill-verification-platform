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
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Issue a new credential NFT to a holder.
     * @param holder Address receiving the credential
     * @param credentialHash Keccak256 hash of credential data
     * @param metadataURI IPFS URI for credential metadata
     */
    function issueCredential(
        address holder,
        string calldata credentialHash,
        string calldata metadataURI
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(holder, tokenId);
        _setTokenURI(tokenId, metadataURI);

        _credentials[tokenId] = Credential({
            holder: holder,
            issuer: msg.sender,
            credentialHash: credentialHash,
            issuedAt: block.timestamp,
            isValid: true
        });

        _holderCredentials[holder].push(tokenId);
        _issuerCredentials[msg.sender].push(tokenId);

