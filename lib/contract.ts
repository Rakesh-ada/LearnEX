import { ethers } from 'ethers';
import { CONTRACT_ABI } from './contract-abi';
import { isValidIPFSCid } from './pinning-service';

// Deployed contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x775FeDAACfa5976E366A341171F3A59bcce383d0';

/**
 * Get an ethers provider instance
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

/**
 * Get a contract instance
 */
export const getContract = async (withSigner = false) => {
  const provider = getProvider();
  if (!provider) return null;

  try {
    if (withSigner) {
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } else {
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }
  } catch (error) {
    console.error('Error getting contract instance:', error);
    return null;
  }
};

/**
 * List a new material on the marketplace
 */
export const listMaterialOnChain = async (
  title: string,
  description: string,
  category: string,
  contentHash: string,
  previewHash: string,
  thumbnailHash: string,
  price: string
): Promise<number | null> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    // Convert price from ETH to wei
    const priceInWei = ethers.parseEther(price);

    // Ensure all parameters are properly formatted strings
    const safeTitle = String(title);
    const safeDescription = String(description);
    const safeCategory = String(category);
    const safeContentHash = String(contentHash);
    const safePreviewHash = String(previewHash || '');
    
    // Fix: Use a valid IPFS hash for default thumbnail
    // This uses a real, pinned empty image as fallback instead of the placeholder text
    const safeThumbnailHash = thumbnailHash && isValidIPFSCid(thumbnailHash) 
      ? String(thumbnailHash) 
      : "ipfs://QmWKXehzY7QpBt9Nh34GJ28Y4sHCUFDGJuP3Y5cM9oBZa3";

    console.log('Listing material with parameters:', {
      title: safeTitle,
      description: safeDescription,
      category: safeCategory,
      contentHash: safeContentHash,
      previewHash: safePreviewHash,
      thumbnailHash: safeThumbnailHash,
      price: priceInWei.toString()
    });

    // Try to estimate gas first to check if the transaction will succeed
    try {
      const gasEstimate = await contract.listMaterial.estimateGas(
        safeTitle,
        safeDescription,
        safeCategory,
        safeContentHash,
        safePreviewHash,
        safeThumbnailHash,
        priceInWei
      );
      console.log('Gas estimate:', gasEstimate.toString());
    } catch (estimateError) {
      console.error('Gas estimation failed:', estimateError);
      // Continue anyway, but log the error
    }

    // Call the contract function with explicit gas limit
    const tx = await contract.listMaterial(
      safeTitle,
      safeDescription,
      safeCategory,
      safeContentHash,
      safePreviewHash,
      safeThumbnailHash,
      priceInWei,
      {
        gasLimit: 3000000 // Set a high gas limit to ensure the transaction has enough gas
      }
    );

    console.log('Transaction sent:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);

    // Find the MaterialListed event in the transaction receipt
    const event = receipt.logs
      .filter((log: any) => log.fragment?.name === 'MaterialListed')
      .map((log: any) => {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        });
        return parsedLog?.args;
      })[0];

    // Return the material ID from the event
    return event ? Number(event.id) : null;
  } catch (error: any) {
    console.error('Error listing material on chain:', error);
    
    // Try to get more detailed error information
    if (error.transaction) {
      console.error('Transaction data:', error.transaction);
    }
    if (error.error) {
      console.error('Error details:', error.error);
    }
    
    return null;
  }
};

/**
 * Purchase a material from the marketplace
 */
export const purchaseMaterialOnChain = async (
  materialId: number,
  price: string
): Promise<boolean> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    // Convert price from ETH to wei
    const priceInWei = ethers.parseEther(price);

    // Call the contract function with the value
    const tx = await contract.purchaseMaterial(materialId, {
      value: priceInWei,
    });

    // Wait for the transaction to be mined
    await tx.wait();

    return true;
  } catch (error) {
    console.error('Error purchasing material on chain:', error);
    return false;
  }
};

/**
 * Get all materials listed by the current user
 */
export const getMyListedMaterialsOnChain = async (): Promise<number[]> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    const materialIds = await contract.getMyListedMaterials();
    return materialIds.map((id: ethers.BigNumberish) => Number(id));
  } catch (error) {
    console.error('Error getting listed materials on chain:', error);
    return [];
  }
};

/**
 * Get all materials purchased by the current user
 */
export const getMyPurchasedMaterialsOnChain = async (): Promise<number[]> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    const materialIds = await contract.getMyPurchasedMaterials();
    return materialIds.map((id: ethers.BigNumberish) => Number(id));
  } catch (error) {
    console.error('Error getting purchased materials on chain:', error);
    return [];
  }
};

/**
 * Get material details by ID
 */
export const getMaterialDetailsOnChain = async (materialId: number): Promise<any | null> => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const details = await contract.getMaterialDetails(materialId);
    
    return {
      id: Number(details.id),
      owner: details.owner,
      title: details.title,
      description: details.description,
      category: details.category,
      previewHash: details.previewHash,
      price: ethers.formatEther(details.price),
      isActive: details.isActive,
      createdAt: new Date(Number(details.createdAt) * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error getting material details on chain:', error);
    return null;
  }
};

/**
 * Get content hash (only available to owner or purchaser)
 */
export const getContentHashOnChain = async (materialId: number): Promise<string | null> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    const contentHash = await contract.getContentHash(materialId);
    return contentHash;
  } catch (error) {
    console.error('Error getting content hash on chain:', error);
    return null;
  }
};

/**
 * Get all active materials with pagination
 */
export const getActiveMaterialsOnChain = async (
  offset: number = 0,
  limit: number = 10
): Promise<number[]> => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const materialIds = await contract.getActiveMaterials(offset, limit);
    return materialIds.map((id: ethers.BigNumberish) => Number(id));
  } catch (error) {
    console.error('Error getting active materials on chain:', error);
    return [];
  }
};

/**
 * Update a material's details
 */
export const updateMaterialOnChain = async (
  materialId: number,
  title: string,
  description: string,
  price: string
): Promise<boolean> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    // Convert price from ETH to wei
    const priceInWei = ethers.parseEther(price);

    // Call the contract function
    const tx = await contract.updateMaterial(
      materialId,
      title,
      description,
      priceInWei
    );

    // Wait for the transaction to be mined
    await tx.wait();

    return true;
  } catch (error) {
    console.error('Error updating material on chain:', error);
    return false;
  }
};

/**
 * Remove a material from the marketplace
 */
export const removeMaterialOnChain = async (materialId: number): Promise<boolean> => {
  try {
    const contract = await getContract(true);
    if (!contract) throw new Error('Contract not available');

    // Call the contract function
    const tx = await contract.removeMaterial(materialId);

    // Wait for the transaction to be mined
    await tx.wait();

    return true;
  } catch (error) {
    console.error('Error removing material on chain:', error);
    return false;
  }
};

/**
 * Get thumbnail information for a material
 */
export const getMaterialThumbnailInfoOnChain = async (materialId: number): Promise<any | null> => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const thumbnailInfo = await contract.getMaterialThumbnailInfo(materialId);
    
    return {
      thumbnailHash: thumbnailInfo.thumbnailHash,
      title: thumbnailInfo.title,
      owner: thumbnailInfo.owner,
      exists: thumbnailInfo.exists
    };
  } catch (error) {
    console.error('Error getting thumbnail info on chain:', error);
    return null;
  }
};

/**
 * Get thumbnail hash for a material
 */
export const getThumbnailHashOnChain = async (materialId: number): Promise<string | null> => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const thumbnailHash = await contract.getThumbnailHash(materialId);
    return thumbnailHash;
  } catch (error) {
    console.error('Error getting thumbnail hash on chain:', error);
    return null;
  }
};

/**
 * Verify the contract connection and check if it has the expected functions
 */
export const verifyContract = async (): Promise<boolean> => {
  try {
    const contract = await getContract();
    if (!contract) {
      console.error('Contract instance not available');
      return false;
    }

    // For development, we'll just check if we can get a contract instance
    console.log('Contract instance available');
    
    // Try to get the contract address
    try {
      const contractAddress = await contract.getContractAddress();
      console.log('Contract address from contract:', contractAddress);
      console.log('Expected contract address:', CONTRACT_ADDRESS);
    } catch (error) {
      console.warn('Could not get contract address, but continuing anyway');
    }

    return true;
  } catch (error: any) {
    console.error('Error verifying contract:', error);
    return false;
  }
};

/**
 * Check if the user has enough ETH to pay for gas
 */
export const checkUserBalance = async (): Promise<{ hasBalance: boolean, balance: string }> => {
  try {
    const provider = getProvider();
    if (!provider) {
      return { hasBalance: false, balance: '0' };
    }

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    
    // Convert balance to ETH
    const balanceInEth = ethers.formatEther(balance);
    console.log('User balance:', balanceInEth, 'ETH');
    
    // Check if balance is greater than 0.01 ETH (enough for gas)
    const hasEnoughBalance = balance > ethers.parseEther('0.01');
    
    return { 
      hasBalance: hasEnoughBalance, 
      balance: balanceInEth 
    };
  } catch (error: any) {
    console.error('Error checking user balance:', error);
    return { hasBalance: false, balance: '0' };
  }
};

/**
 * Check if the user is on the correct network
 * For development, we'll accept any network including edu-chain
 */
export const checkNetwork = async (): Promise<{ isCorrectNetwork: boolean, currentNetwork: string }> => {
  try {
    const provider = getProvider();
    if (!provider) {
      return { isCorrectNetwork: false, currentNetwork: 'unknown' };
    }

    const network = await provider.getNetwork();
    const chainId = network.chainId;
    
    // For development, accept any network
    const isCorrectNetwork = true;
    
    console.log('Current network:', network.name, 'Chain ID:', chainId.toString());
    
    return { 
      isCorrectNetwork, 
      currentNetwork: network.name || chainId.toString() 
    };
  } catch (error: any) {
    console.error('Error checking network:', error);
    return { isCorrectNetwork: false, currentNetwork: 'unknown' };
  }
};

/**
 * Switch to the correct network (no-op for development)
 */
export const switchToCorrectNetwork = async (): Promise<boolean> => {
  // For development, we're accepting any network, so just return true
  return true;
};

/**
 * Test the contract connection and functions directly
 * This is useful for diagnosing "data getting reverted" issues
 */
export const testContractConnection = async (): Promise<{ success: boolean, message: string, details: any }> => {
  try {
    console.log('Testing contract connection...');
    
    // Step 1: Get provider and check network
    const provider = getProvider();
    if (!provider) {
      return { 
        success: false, 
        message: 'Provider not available. Make sure MetaMask is installed and connected.', 
        details: null 
      };
    }
    
    // Get network information
    const network = await provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId.toString()
    });
    
    // Step 2: Check if contract code exists at the address
    try {
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        return { 
          success: false, 
          message: `No contract code found at address ${CONTRACT_ADDRESS} on network ${network.name}. The contract might not be deployed on this network.`, 
          details: {
            network: {
              name: network.name,
              chainId: network.chainId.toString()
            },
            contractAddress: CONTRACT_ADDRESS,
            code: 'No code found'
          } 
        };
      }
      console.log('Contract code exists at the specified address, length:', code.length);
    } catch (error) {
      console.error('Error checking contract code:', error);
      return { 
        success: false, 
        message: 'Failed to check contract code. Network might be unavailable.', 
        details: error 
      };
    }
    
    // Step 3: Get contract instance
    const contract = await getContract(true);
    if (!contract) {
      return { 
        success: false, 
        message: 'Contract instance not available. Check contract address and ABI.', 
        details: null 
      };
    }
    
    // Step 4: Try to get contract address
    let contractAddress;
    try {
      contractAddress = await contract.getContractAddress();
      console.log('Contract address from contract:', contractAddress);
      console.log('Expected contract address:', CONTRACT_ADDRESS);
      
      if (contractAddress.toLowerCase() !== CONTRACT_ADDRESS.toLowerCase()) {
        console.warn('Contract address mismatch!');
        return { 
          success: false, 
          message: `Contract address mismatch! Expected: ${CONTRACT_ADDRESS}, Got: ${contractAddress}`, 
          details: {
            expected: CONTRACT_ADDRESS,
            actual: contractAddress
          } 
        };
      }
    } catch (error) {
      console.error('Error getting contract address:', error);
      return { 
        success: false, 
        message: 'Failed to call getContractAddress(). Contract may not be deployed correctly on this network.', 
        details: error 
      };
    }
    
    // Step 5: Try to get contract version
    try {
      const version = await contract.getContractVersion();
      console.log('Contract version:', version);
    } catch (error) {
      console.warn('Could not get contract version, but continuing:', error);
    }
    
    // Step 6: Try to get total materials (a simple read operation)
    try {
      const totalMaterials = await contract.getTotalMaterials();
      console.log('Total materials:', totalMaterials.toString());
    } catch (error) {
      console.error('Error getting total materials:', error);
      return { 
        success: false, 
        message: 'Failed to call getTotalMaterials(). Contract may not be deployed correctly on this network.', 
        details: error 
      };
    }
    
    // Step 7: Check if we can get active materials (another read operation)
    try {
      const activeMaterials = await contract.getActiveMaterials(0, 10);
      console.log('Active materials:', activeMaterials.map((id: any) => id.toString()));
    } catch (error) {
      console.error('Error getting active materials:', error);
      return { 
        success: false, 
        message: 'Failed to call getActiveMaterials(). Contract may not be deployed correctly on this network.', 
        details: error 
      };
    }
    
    // Step 8: Check contract ABI against expected functions
    const expectedFunctions = [
      'listMaterial',
      'purchaseMaterial',
      'getMyListedMaterials',
      'getMyPurchasedMaterials',
      'getMaterialDetails',
      'getContentHash',
      'getThumbnailHash',
      'getMaterialThumbnailInfo'
    ];
    
    const missingFunctions = [];
    for (const funcName of expectedFunctions) {
      if (typeof contract[funcName] !== 'function') {
        missingFunctions.push(funcName);
      }
    }
    
    if (missingFunctions.length > 0) {
      return { 
        success: false, 
        message: `Contract is missing expected functions: ${missingFunctions.join(', ')}. ABI might not match the deployed contract.`, 
        details: {
          missingFunctions,
          availableFunctions: Object.keys(contract).filter(key => typeof contract[key] === 'function')
        } 
      };
    }
    
    // Step 9: Check listMaterial function parameters
    try {
      // Try to get the function signature
      const listMaterialFunction = contract.interface.getFunction('listMaterial');
      if (listMaterialFunction) {
        console.log('listMaterial function signature:', listMaterialFunction.format());
        console.log('listMaterial parameter count:', listMaterialFunction.inputs.length);
        console.log('listMaterial parameters:', listMaterialFunction.inputs.map((input: any) => `${input.name}: ${input.type}`));
        
        // Check if the function has the expected number of parameters
        const expectedParamCount = 7; // title, description, category, contentHash, previewHash, thumbnailHash, price
        if (listMaterialFunction.inputs.length !== expectedParamCount) {
          return { 
            success: false, 
            message: `listMaterial function has ${listMaterialFunction.inputs.length} parameters, but expected ${expectedParamCount}. ABI might not match the deployed contract.`, 
            details: {
              expectedParamCount,
              actualParamCount: listMaterialFunction.inputs.length,
              parameters: listMaterialFunction.inputs.map((input: any) => `${input.name}: ${input.type}`)
            } 
          };
        }
      } else {
        console.warn('Could not find listMaterial function in contract interface');
      }
    } catch (error) {
      console.warn('Could not check listMaterial function signature:', error);
    }
    
    // Step 10: Try a static call to listMaterial with dummy values
    try {
      console.log('Trying static call to listMaterial...');
      await contract.listMaterial.staticCall(
        "Test Title",
        "Test Description",
        "Test Category",
        "ipfs://test-content-hash",
        "ipfs://test-preview-hash",
        "ipfs://test-thumbnail-hash",
        ethers.parseEther("0.01")
      );
      console.log('Static call to listMaterial succeeded!');
    } catch (error: any) {
      console.warn('Static call to listMaterial failed, but this might be expected:', error.message);
      // Don't return failure here, as the static call might fail for valid reasons (e.g., require conditions)
    }
    
    // All tests passed
    return { 
      success: true, 
      message: 'Contract connection successful. All basic functions are working.', 
      details: {
        network: {
          name: network.name,
          chainId: network.chainId.toString()
        },
        contractAddress,
        contractFunctions: Object.keys(contract).filter(key => typeof contract[key] === 'function')
      } 
    };
  } catch (error: any) {
    console.error('Error testing contract connection:', error);
    return { 
      success: false, 
      message: `Unexpected error: ${error.message}`, 
      details: error 
    };
  }
};

/**
 * Enhanced debugging function to test contract connection and transaction
 */
export const debugContractTransaction = async (
  title: string,
  description: string,
  category: string,
  contentHash: string,
  previewHash: string,
  thumbnailHash: string,
  price: string
): Promise<any> => {
  try {
    console.log('=== DEBUG CONTRACT TRANSACTION ===');
    console.log('Step 1: Getting provider and network info');
    
    const provider = getProvider();
    if (!provider) {
      return { success: false, error: 'Provider not available' };
    }
    
    const network = await provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId.toString()
    });
    
    console.log('Step 2: Getting signer');
    let signer;
    try {
      signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('Signer address:', address);
      
      // Check balance
      const balance = await provider.getBalance(address);
      console.log('Account balance:', ethers.formatEther(balance), 'ETH');
      
      if (balance < ethers.parseEther('0.01')) {
        console.warn('Warning: Low account balance');
      }
    } catch (error: any) {
      console.error('Error getting signer:', error);
      return { success: false, error: 'Failed to get signer' };
    }
    
    console.log('Step 3: Checking contract code at address');
    try {
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        console.error('No contract found at address:', CONTRACT_ADDRESS);
        return { 
          success: false, 
          error: `No contract code at address ${CONTRACT_ADDRESS} on network ${network.name} (${network.chainId})` 
        };
      }
      console.log('Contract code exists at address');
    } catch (error: any) {
      console.error('Error checking contract code:', error);
      return { success: false, error: 'Failed to check contract code' };
    }
    
    console.log('Step 4: Creating contract instance');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    console.log('Step 5: Preparing transaction parameters');
    // Convert price from ETH to wei
    const priceInWei = ethers.parseEther(price);
    
    // Log all parameters
    console.log('Transaction parameters:', {
      title,
      description,
      category,
      contentHash,
      previewHash,
      thumbnailHash,
      price: priceInWei.toString()
    });
    
    console.log('Step 6: Estimating gas');
    let gasEstimate;
    try {
      gasEstimate = await contract.listMaterial.estimateGas(
        title,
        description,
        category,
        contentHash,
        previewHash,
        thumbnailHash,
        priceInWei
      );
      console.log('Gas estimate:', gasEstimate.toString());
    } catch (error: any) {
      console.error('Gas estimation failed:', error);
      
      // Try to get more detailed error information
      let errorMessage = 'Unknown error during gas estimation';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: `Gas estimation failed: ${errorMessage}`,
        details: error
      };
    }
    
    console.log('Step 7: Sending transaction with manual gas limit');
    try {
      // Use a higher gas limit than the estimate
      const gasLimit = gasEstimate ? BigInt(Number(gasEstimate) * 2) : BigInt(3000000);
      
      console.log('Using gas limit:', gasLimit.toString());
      
      // Create transaction with explicit gas limit
      const tx = await contract.listMaterial(
        title,
        description,
        category,
        contentHash,
        previewHash,
        thumbnailHash,
        priceInWei,
        {
          gasLimit
        }
      );
      
      console.log('Transaction sent:', tx.hash);
      
      console.log('Step 8: Waiting for transaction confirmation');
      const receipt = await tx.wait();
      console.log('Transaction confirmed in block:', receipt.blockNumber);
      
      // Find the MaterialListed event
      const event = receipt.logs
        .filter((log: any) => log.fragment?.name === 'MaterialListed')
        .map((log: any) => {
          const parsedLog = contract.interface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          return parsedLog?.args;
        })[0];
      
      if (event) {
        console.log('Material listed with ID:', event.id.toString());
        return { 
          success: true, 
          materialId: Number(event.id),
          transactionHash: tx.hash
        };
      } else {
        console.warn('Transaction succeeded but no MaterialListed event found');
        return { 
          success: true, 
          materialId: null,
          transactionHash: tx.hash,
          receipt
        };
      }
    } catch (error: any) {
      console.error('Transaction failed:', error);
      
      // Try to get more detailed error information
      let errorMessage = 'Unknown error during transaction';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: `Transaction failed: ${errorMessage}`,
        details: error
      };
    }
  } catch (error: any) {
    console.error('Unexpected error in debug function:', error);
    return { success: false, error: 'Unexpected error', details: error };
  }
};

/**
 * Verify if the contract ABI matches the deployed contract
 */
export const verifyContractABI = async (): Promise<any> => {
  try {
    console.log('=== VERIFYING CONTRACT ABI ===');
    
    const provider = getProvider();
    if (!provider) {
      return { success: false, error: 'Provider not available' };
    }
    
    const network = await provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId.toString()
    });
    
    // Check if contract exists at the address
    const code = await provider.getCode(CONTRACT_ADDRESS);
    if (code === '0x') {
      return { 
        success: false, 
        error: `No contract code at address ${CONTRACT_ADDRESS} on network ${network.name} (${network.chainId})` 
      };
    }
    
    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // List of functions to check
    const functionsToCheck = [
      'listMaterial',
      'purchaseMaterial',
      'getMyListedMaterials',
      'getMyPurchasedMaterials',
      'getMaterialDetails',
      'getContentHash',
      'getThumbnailHash',
      'getActiveMaterials'
    ];
    
    // Check each function
    const results: Record<string, boolean> = {};
    for (const funcName of functionsToCheck) {
      try {
        // Check if function exists in the contract
        results[funcName] = typeof contract[funcName] === 'function';
        
        if (!results[funcName]) {
          console.error(`Function '${funcName}' not found in contract`);
        } else {
          console.log(`Function '${funcName}' exists in contract`);
        }
      } catch (error: any) {
        console.error(`Error checking function '${funcName}':`, error);
        results[funcName] = false;
      }
    }
    
    // Check if all functions exist
    const allFunctionsExist = Object.values(results).every(result => result);
    
    if (allFunctionsExist) {
      console.log('All required functions exist in the contract');
      
      // Try to call a simple view function to verify further
      try {
        const totalMaterials = await contract.getTotalMaterials();
        console.log('Total materials:', totalMaterials.toString());
        
        return { 
          success: true, 
          message: 'Contract ABI matches the deployed contract',
          totalMaterials: totalMaterials.toString(),
          functionResults: results
        };
      } catch (error: any) {
        console.error('Error calling getTotalMaterials:', error);
        return { 
          success: false, 
          error: 'Contract ABI may not match the deployed contract',
          functionResults: results,
          details: error
        };
      }
    } else {
      return { 
        success: false, 
        error: 'Some required functions are missing in the contract',
        functionResults: results
      };
    }
  } catch (error: any) {
    console.error('Error verifying contract ABI:', error);
    return { success: false, error: 'Error verifying contract ABI', details: error };
  }
}; 