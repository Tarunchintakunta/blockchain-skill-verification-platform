import { ethers } from "ethers";

const CONTRACT_ABI = [
  "function issueCredential(address holder, string calldata credentialHash, string calldata metadataURI) external returns (uint256)",
  "function verifyCredential(uint256 tokenId) external view returns (address holder, address issuer, string credentialHash, uint256 issuedAt, bool isValid)",
  "function revokeCredential(uint256 tokenId) external",
  "function getCredentialsByHolder(address holder) external view returns (uint256[])",
  "function getCredentialsByIssuer(address issuer) external view returns (uint256[])",
  "event CredentialIssued(uint256 indexed tokenId, address indexed holder, address indexed issuer, string credentialHash)",
  "event CredentialRevoked(uint256 indexed tokenId)",
];

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
}

function getSigner() {
  const provider = getProvider();
  return new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY!, provider);
}

function getContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error("Contract address not configured");
  return new ethers.Contract(
    contractAddress,
    CONTRACT_ABI,
    signerOrProvider || getProvider()
  );
}
