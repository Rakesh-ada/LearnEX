# StudyMarketplace Contract Deployment Guide

This guide will walk you through deploying the StudyMarketplace smart contract using Remix IDE and integrating it with your application.

## Current Deployment

The contract is currently deployed at address `0x775FeDAACfa5976E366A341171F3A59bcce383d0` on the edu-chain network (Chain ID: 656476).

## Deploying with Remix IDE

### Step 1: Open Remix IDE
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `StudyMarketplace.sol`
3. Copy and paste the entire contract code from `StudyMarketplace.sol` into the editor

### Step 2: Compile the Contract
1. Click on the "Solidity Compiler" tab (second icon on the left sidebar)
2. Select compiler version `0.8.20` (or compatible)
3. Click "Compile StudyMarketplace.sol"
4. Ensure there are no compilation errors

### Step 3: Deploy the Contract
1. Click on the "Deploy & Run Transactions" tab (third icon on the left sidebar)
2. Select the environment:
   - For testing: Choose "Injected Provider - MetaMask" and connect to the edu-chain network
   - For production: Choose "Injected Provider - MetaMask" and connect to Ethereum Mainnet
3. Select the `StudyMarketplace` contract from the dropdown
4. In the "Deploy" section, enter your wallet address as the `_platformFeeRecipient` parameter
   - This address will receive platform fees from sales
5. Click "Deploy" and confirm the transaction in MetaMask
6. Wait for the transaction to be mined

### Step 4: Verify the Contract (Optional but Recommended)
1. After deployment, copy the contract address
2. Go to the block explorer for your network (if available)
3. Search for your contract address
4. Click on the "Contract" tab
5. Click "Verify and Publish"
6. Follow the verification steps:
   - Select compiler version `0.8.20`
   - Select "Single file" for optimization
   - Paste the entire contract code
   - Click "Verify and Publish"

## Integrating with Your Application

### Step 1: Create a .env File
Create a `.env.local` file in the root of your project with the following content:

```
# Contract Information
NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=656476  # edu-chain network ID

# IPFS Configuration
NEXT_PUBLIC_PINATA_API_KEY=YOUR_PINATA_API_KEY
NEXT_PUBLIC_PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET_KEY
NEXT_PUBLIC_PINATA_JWT=YOUR_PINATA_JWT

# Platform Settings
NEXT_PUBLIC_PLATFORM_FEE_PERCENT=2.5  # Platform fee in percentage
```

Replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with the address of your deployed contract.

### Step 2: Update Contract Address in Your Code
Update the contract address in your application code:

1. Open `lib/contract.ts`
2. Update the `CONTRACT_ADDRESS` constant:

```typescript
// Deployed contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
```

### Step 3: Export the Contract ABI
1. In Remix, go to the "Solidity Compiler" tab
2. Click on "Compilation Details"
3. Find and copy the ABI section
4. Create a file `lib/contract-abi.ts` with the following content:

```typescript
export const CONTRACT_ABI = [
  // Paste the ABI here
];
```

### Step 4: Update the ABI Import
In `lib/blockchain.ts`, update the ABI import:

```typescript
import { CONTRACT_ABI } from './contract-abi';
```

## Testing Your Deployment

1. Start your application: `npm run dev`
2. Connect your wallet (make sure it's on the edu-chain network)
3. Try to list a study material
4. Check the console for any errors
5. Verify that the material appears in the marketplace

## Troubleshooting

If you encounter issues:

1. **Transaction Reverts**: Check that you're passing the correct parameters to contract functions
2. **Missing Revert Data**: Ensure your contract address is correct and the contract is deployed on the network you're connected to
3. **Network Issues**: Make sure your wallet is connected to the edu-chain network
4. **Gas Errors**: Try increasing the gas limit for your transactions

## Contract Functions Reference

Here's a quick reference of the main functions in the StudyMarketplace contract:

- `listMaterial`: List a new study material for sale
- `purchaseMaterial`: Purchase a study material
- `getMyListedMaterials`: Get all materials listed by the caller
- `getMyPurchasedMaterials`: Get all materials purchased by the caller
- `getMaterialDetails`: Get details of a specific material
- `getContentHash`: Get the content hash (only for owner or purchaser)
- `getThumbnailHash`: Get the thumbnail hash of a material
- `getActiveMaterials`: Get all active materials with pagination 