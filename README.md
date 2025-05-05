# LearnEX - Decentralized Learning Platform

A decentralized marketplace for buying and selling educational materials using blockchain technology with enhanced security and accessibility.

![LearnEX UI](public/learnex-ui.png)

*LearnEX platform interface - Decentralized Study Material Library*

## Overview

LearnEX is a revolutionary decentralized educational platform that addresses critical challenges in the global education ecosystem. By leveraging blockchain technology, IPFS storage, and advanced encryption, LearnEX creates a secure, accessible, and equitable marketplace for educational content. Creators can list materials on the blockchain and earn cryptocurrency when users purchase their content, while all materials are stored on IPFS with optional AES encryption via Lit Protocol for enhanced security and privacy.

## Research & Real-World Impact

### The Global Education Crisis

Research from UNESCO and the World Bank highlights several critical challenges in global education:

- **Access Inequality**: Over 258 million children and youth remain out of school worldwide, with disparities particularly affecting low-income regions.
- **Content Censorship**: Educational materials face censorship in many regions, limiting access to diverse perspectives and critical knowledge.
- **Creator Compensation**: Educational content creators often struggle to receive fair compensation for their work, with traditional publishing models taking substantial cuts.
- **Digital Divide**: The COVID-19 pandemic exposed the digital divide, with 463 million students unable to access remote learning during school closures.
- **Educational Privacy**: Student data privacy concerns have grown as educational technology adoption increases, with inadequate protection for sensitive information.

### How LearnEX Addresses These Challenges

LearnEX provides innovative solutions to these pressing issues:

1. **Decentralized Access**: By leveraging blockchain and IPFS, LearnEX creates a censorship-resistant platform accessible from anywhere with internet connectivity, bypassing regional restrictions.

2. **Creator Empowerment**: Direct peer-to-peer transactions ensure creators receive fair compensation for their work, with transparent fee structures and immediate payments.

3. **Enhanced Security**: Implementation of AES encryption with Lit Protocol ensures that sensitive educational materials remain private and accessible only to authorized users, protecting intellectual property and student privacy.

4. **Economic Inclusion**: Cryptocurrency payments enable participation from unbanked or underbanked populations, expanding educational access to regions with limited traditional banking infrastructure.

5. **Transparent Verification**: Blockchain-based verification of educational credentials and content authenticity helps combat misinformation and ensures quality standards.

## Features

- List educational materials with title, description, category, and price
- Upload content files to IPFS with optional AES encryption via Lit Protocol
- Owner-only decryption for sensitive educational content
- Interactive 3D thumbnails for different subject categories
- Purchase materials using cryptocurrency
- View purchased materials with secure decryption
- Platform fee system for sustainability
- Deploy your own contracts with step-by-step guide and video tutorials
- EDU Chain Explorer for tracking transactions and contract interactions

## System Architecture

LearnEX employs a sophisticated multi-layered architecture designed for security, scalability, and decentralization:

![LearnEX Workflow](public/learnex-workflow.png)

*LearnEX platform workflow showing user onboarding, course marketplace, uploading process, content management, and blockchain integration*

### Core Architectural Layers

#### 1. Presentation Layer
- **Next.js Frontend**: Server-side rendered React application providing responsive UI across devices
- **TailwindCSS**: Utility-first CSS framework for consistent design system
- **3D Visualization**: Three.js-powered interactive subject category visualization
- **Framer Motion**: Advanced animations for enhanced user experience

#### 2. Application Layer
- **React Components**: Modular component system for maintainable UI development
- **Custom Hooks**: Specialized hooks for wallet connection, authentication, and blockchain interactions
- **Context Providers**: Global state management for user session, wallet status, and application settings
- **Form Validation**: Zod-powered schema validation for data integrity

#### 3. Security Layer
- **AES Encryption**: Advanced Encryption Standard implementation via Lit Protocol
- **Access Control**: Wallet-based authentication for content access
- **Metadata Separation**: Encryption metadata stored separately from content for enhanced security
- **Client-Side Decryption**: All decryption occurs locally in the user's browser

#### 4. Blockchain Layer
- **Smart Contracts**: Solidity contracts for marketplace functionality
- **Transaction Management**: Ethers.js for reliable transaction handling
- **Gas Optimization**: Efficient contract design to minimize transaction costs
- **Multi-Chain Support**: Compatibility with various EVM-compatible networks

#### 5. Storage Layer
- **IPFS Integration**: Content distributed across the InterPlanetary File System
- **Pinata Service**: Reliable pinning service to ensure content availability
- **Content Addressing**: Content-addressed storage for immutability and verification
- **Metadata Management**: Structured metadata for efficient content discovery

#### 6. Integration Layer
- **API Services**: RESTful services for third-party integrations
- **Webhook Support**: Event-driven architecture for extensibility
- **Analytics Integration**: Anonymous usage tracking for platform improvement
- **External Identity Providers**: Support for various authentication methods

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Three.js, Framer Motion
- **Blockchain**: Ethereum-compatible networks (currently deployed on edu-chain)
- **Storage**: IPFS via Pinata with AES encryption via Lit Protocol
- **Web3 Integration**: ethers.js v6
- **Authentication**: Wallet-based authentication with MetaMask
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask wallet
- Pinata account for IPFS storage

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/study-marketplace.git
   cd study-marketplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```
   cp .env.example .env.local
   ```

4. Update the `.env.local` file with your contract address and Pinata API keys:
   ```
   # Contract Information
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xe12D1e1698d7E07206b5C6C49466631c4dDfbF1B
   NEXT_PUBLIC_CHAIN_ID=656476  # edu-chain network ID

   # IPFS Configuration
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
   NEXT_PUBLIC_PLATFORM_FEE_PERCENT=2.5
   ```

### Deployment to GitHub

If you plan to deploy this project to GitHub Pages or use GitHub Actions for CI/CD, follow these steps:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following repository secrets:
   - `NEXT_PUBLIC_PINATA_API_KEY` - Your Pinata API key
   - `NEXT_PUBLIC_PINATA_API_SECRET` - Your Pinata API secret
   - `NEXT_PUBLIC_PINATA_JWT` - Your Pinata JWT token

4. (Optional) If you're using GitHub Pages, make sure to configure your workflow to set these environment variables during the build process:
   ```yaml
   env:
     NEXT_PUBLIC_PINATA_API_KEY: ${{ secrets.NEXT_PUBLIC_PINATA_API_KEY }}
     NEXT_PUBLIC_PINATA_API_SECRET: ${{ secrets.NEXT_PUBLIC_PINATA_API_SECRET }}
     NEXT_PUBLIC_PINATA_JWT: ${{ secrets.NEXT_PUBLIC_PINATA_JWT }}
     NEXT_PUBLIC_CONTRACT_ADDRESS: "0xe12D1e1698d7E07206b5C6C49466631c4dDfbF1B"
     NEXT_PUBLIC_CHAIN_ID: "656476"
     NEXT_PUBLIC_PLATFORM_FEE_PERCENT: "2.5"
   ```

### Smart Contract Deployment

You have two options for deploying the smart contract:

#### Option 1: Use the Default Contract

The contract is currently deployed at address `0xe12D1e1698d7E07206b5C6C49466631c4dDfbF1B` on the edu-chain network.

#### Option 2: Deploy Your Own Contract

1. Navigate to the "Organization" tab in the application
2. Select the "Deployment Guide" tab
3. Follow the step-by-step instructions:
   - Prepare your contracts (StudyMarketplace.sol or SchoolLibrary.sol)
   - Open Remix IDE
   - Create & compile the smart contract
   - Deploy with MetaMask
   - Copy the contract address to use in the application
4. Watch the embedded video tutorial for detailed guidance
5. Get test ETH from the [EDU-Chain HackQuest Faucet](https://www.hackquest.io/faucets/656476) before deploying

After deployment, update the contract address in your `.env.local` file.

### Running the Application

```
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### For Content Creators

1. Connect your wallet to the edu-chain network
2. Navigate to "Upload Material"
3. Fill in the details and upload your content
4. Set a price and list your material

### For Learners

1. Connect your wallet to the edu-chain network
2. Browse available materials
3. Purchase materials you're interested in
4. Access your purchased materials in "My Library"

### For Organizations

1. Connect your wallet to the edu-chain network
2. Navigate to the "Organization" tab
3. Deploy your own contract or explore existing contracts
4. View transactions, contract information, and analytics
5. Verify your contract on the EDU Chain explorer

## Project Structure

- `/app` - Next.js app router pages and components
- `/components` - React components
- `/contracts` - Smart contract code and deployment guide
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and blockchain interactions
- `/public` - Static assets
- `/styles` - Global CSS styles

## Future Development Plans

LearnEX is continuously evolving to provide better security, accessibility, and functionality. Here are some of the key features planned for future releases:

### Enhanced Security Features

- **Lit Protocol Integration**: Implement decentralized access control using Lit Protocol to enable content creators to define complex access conditions beyond simple ownership.
- **AES Encryption**: Add Advanced Encryption Standard (AES) encryption for all uploaded documents to ensure that sensitive educational materials remain private and can only be accessed by authorized users.
- **Multi-Factor Authentication**: Introduce additional authentication methods beyond wallet signatures for enhanced account security.

### Platform Enhancements

- **Mobile Application**: Develop native mobile applications for iOS and Android to improve accessibility.
- **Offline Access**: Enable downloading encrypted content for offline study with secure local storage.
- **AI-Powered Content Recommendations**: Implement machine learning algorithms to suggest relevant educational materials based on user interests and learning patterns.
- **Decentralized Identity**: Integrate DIDs (Decentralized Identifiers) for portable academic credentials and achievements.

### Community Features

- **Collaborative Learning Spaces**: Create virtual study rooms where users can collaborate on educational content.
- **Peer Review System**: Implement a decentralized peer review process for quality assurance of educational materials.
- **Creator Reputation System**: Develop a reputation system for content creators based on user ratings and engagement metrics.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

