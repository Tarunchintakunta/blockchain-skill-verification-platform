# Blockchain Skill Verification Platform

A blockchain-enabled skill verification platform integrating smart contracts with AI-powered assessment and machine learning based job matching.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL (Neon Serverless), Drizzle ORM
- **Blockchain**: Solidity, Ethers.js, Polygon Testnet
- **AI/ML**: Custom assessment engine, ML-based job matching algorithm

## Features

- Blockchain-based NFT credentials (ERC721)
- AI-powered skill assessments with auto-grading
- ML-based job matching with weighted skill scoring
- Role-based dashboards (Candidate, Employer, Institution)
- Wallet integration for credential verification
- Real-time analytics and market insights

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Push database schema: `npx drizzle-kit push`
5. Run development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Smart Contract

Deploy `contracts/SkillCredential.sol` to Polygon Amoy testnet using Remix or Hardhat.

## License

MIT
