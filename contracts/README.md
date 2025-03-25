# Study Marketplace Smart Contract

This directory contains the smart contract for the Study Marketplace application. The contract handles listing, purchasing, and managing study materials on the blockchain.

## Using the Smart Contract with Remix IDE

### Step 1: Access Remix IDE

1. Open your web browser and go to [Remix IDE](https://remix.ethereum.org/)
2. You'll see the Remix IDE interface with a file explorer on the left side

### Step 2: Create a New File

1. In the file explorer, click the "+" button to create a new file
2. Name the file `StudyMarketplace.sol`
3. Copy and paste the entire content of the `StudyMarketplace.sol` file from this repository into the Remix editor

### Step 3: Compile the Contract

1. Click on the "Solidity Compiler" tab (second icon on the left sidebar)
2. Make sure the compiler version is set to 0.8.20 or compatible
3. Click the "Compile StudyMarketplace.sol" button
4. Verify that compilation is successful (you should see a green checkmark)

### Step 4: Deploy the Contract

1. Click on the "Deploy & Run Transactions" tab (third icon on the left sidebar)
2. Make sure the environment is set to "Injected Provider - MetaMask" (this will connect to your MetaMask wallet)
3. Connect your MetaMask wallet when prompted
4. In the "Contract" dropdown, select "StudyMarketplace"
5. In the "Deploy" section, enter your wallet address as the `_platformFeeRecipient` parameter
6. Click the "Deploy" button and confirm the transaction in MetaMask
7. Once deployed, the contract will appear under "Deployed Contracts"

### Step 5: Interact with the Contract

After deployment, you can interact with the contract through Remix:

1. Expand the deployed contract to see all available functions
2. Use the following functions to test the marketplace:
   - `listMaterial`: List a new study material
   - `purchaseMaterial`: Purchase a study material (make sure to include the correct ETH value)
   - `getMyListedMaterials`: View materials you've listed
   - `getMyPurchasedMaterials`: View materials you've purchased
   - `getMaterialDetails`: Get details about a specific material

## Contract Functions

### Main Functions

- `listMaterial`: List a new study material on the marketplace
- `purchaseMaterial`: Purchase a study material
- `updateMaterial`: Update details of a listed material
- `removeMaterial`: Remove a material from the marketplace
- `getContentHash`: Get the content hash (only available to owner or purchaser)

### Administrative Functions

- `updatePlatformFee`: Update the platform fee percentage (only available to platform owner)

### View Functions

- `getMyListedMaterials`: Get all materials listed by the caller
- `getMyPurchasedMaterials`: Get all materials purchased by the caller
- `getMaterialDetails`: Get details about a specific material
- `getTotalMaterials`: Get the total number of materials
- `getActiveMaterials`: Get active materials with pagination

## Integration with Frontend

To integrate this smart contract with the frontend:

1. Deploy the contract to a testnet or mainnet
2. Update the `CONTRACT_ADDRESS` in `lib/blockchain.ts` with your deployed contract address
3. Update the `CONTRACT_ABI` if you've made any changes to the contract interface
4. Use the functions in `lib/blockchain.ts` to interact with the contract from your frontend

## Testing

Before deploying to mainnet, thoroughly test the contract on a testnet like Sepolia or Goerli to ensure everything works as expected. 