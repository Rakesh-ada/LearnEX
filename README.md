# Study Marketplace - Decentralized Learning Platform

A decentralized marketplace for buying and selling educational materials using blockchain technology.

## Overview

Study Marketplace allows creators to list educational materials on the blockchain and earn cryptocurrency when users purchase their content. All content is stored on IPFS for decentralized, censorship-resistant hosting.

## Features

- List educational materials with title, description, category, and price
- Upload content files to IPFS
- Interactive 3D thumbnails for different subject categories
- Purchase materials using cryptocurrency
- View purchased materials
- Platform fee system for sustainability

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum-compatible networks (currently deployed on edu-chain)
- **Storage**: IPFS via Pinata
- **Web3 Integration**: ethers.js

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
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x775FeDAACfa5976E366A341171F3A59bcce383d0
   NEXT_PUBLIC_CHAIN_ID=656476  # edu-chain network ID

   # IPFS Configuration
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
   ```

### Smart Contract Deployment

The contract is currently deployed at address `0x775FeDAACfa5976E366A341171F3A59bcce383d0` on the edu-chain network.

If you need to deploy your own contract:

1. Follow the instructions in `contracts/DEPLOYMENT_GUIDE.md` to deploy the smart contract using Remix IDE.
2. Update the contract address in your `.env.local` file.

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

## Project Structure

- `/app` - Next.js app router pages and components
- `/components` - React components
- `/contracts` - Smart contract code and deployment guide
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and blockchain interactions
- `/public` - Static assets
- `/styles` - Global CSS styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 3D Thumbnails

The application features interactive 3D thumbnails for different subject categories. These thumbnails are rendered using Three.js and React Three Fiber, providing a more engaging visual representation of each subject.

### Viewing the 3D Thumbnails

Navigate to the `/thumbnails` route to see all available 3D thumbnails. You can toggle between 3D and 2D modes using the checkbox.

### Generating Custom 3D Thumbnails

If you want to generate custom 3D thumbnails:

1. Run the 3D thumbnail generator:
   ```
   node scripts/serve-3d-generator.js
   ```

2. Open `http://localhost:3001` in your browser
3. Use the controls to rotate and download the thumbnails
4. Place the downloaded PNG files in the `public/thumbnails` directory 