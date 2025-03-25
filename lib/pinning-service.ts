/**
 * IPFS Pinning Service Utility
 * 
 * This utility provides functions to interact with Pinata's IPFS pinning service.
 * It allows pinning content to IPFS and retrieving pinned content.
 */

import axios from 'axios';

// Pinata API configuration
// In a production environment, these would be stored in environment variables
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET || '';
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';

// Pinata API endpoints
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

/**
 * Pins a file to IPFS using Pinata
 * 
 * @param file - The file to pin
 * @param progressCallback - Optional callback for upload progress (0-1)
 * @param name - Optional name for the file
 * @returns The IPFS CID and gateway URL
 */
export async function pinFileToIPFS(
  file: File, 
  progressCallback?: (progress: number) => void,
  name?: string
): Promise<{ cid: string, url: string, gatewayUrl: string }> {
  try {
    // If progress callback is a string, it's the name (for backward compatibility)
    if (typeof progressCallback === 'string') {
      name = progressCallback;
      progressCallback = undefined;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Add metadata if name is provided
    if (name) {
      const metadata = JSON.stringify({
        name,
        keyvalues: {
          source: 'study-marketplace',
          timestamp: Date.now()
        }
      });
      formData.append('pinataMetadata', metadata);
    }
    
    // Configure pinning options
    const pinataOptions = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', pinataOptions);
    
    // Make API request to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
          Authorization: `Bearer ${PINATA_JWT}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressCallback && progressEvent.total) {
            const progress = progressEvent.loaded / progressEvent.total;
            progressCallback(progress);
          }
        }
      }
    );
    
    // Extract CID from response
    const cid = response.data.IpfsHash;
    const url = `ipfs://${cid}`;
    const gatewayUrl = `${PINATA_GATEWAY}${cid}`;
    
    return { cid, url, gatewayUrl };
  } catch (error) {
    console.error('Error pinning file to IPFS:', error);
    throw new Error('Failed to pin file to IPFS');
  }
}

/**
 * Pins JSON data to IPFS using Pinata
 * 
 * @param jsonData - The JSON data to pin
 * @param name - Optional name for the data
 * @returns The IPFS CID and gateway URL
 */
export async function pinJSONToIPFS(jsonData: any, name?: string): Promise<{ cid: string, url: string, gatewayUrl: string }> {
  try {
    // Prepare metadata if name is provided
    const metadata = name ? {
      name,
      keyvalues: {
        source: 'study-marketplace',
        timestamp: Date.now()
      }
    } : undefined;
    
    // Make API request to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      {
        pinataContent: jsonData,
        pinataMetadata: metadata,
        pinataOptions: {
          cidVersion: 1
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    // Extract CID from response
    const cid = response.data.IpfsHash;
    const url = `ipfs://${cid}`;
    const gatewayUrl = `${PINATA_GATEWAY}${cid}`;
    
    return { cid, url, gatewayUrl };
  } catch (error) {
    console.error('Error pinning JSON to IPFS:', error);
    throw new Error('Failed to pin JSON to IPFS');
  }
}

/**
 * Pins content from an existing IPFS CID using Pinata
 * 
 * @param cid - The IPFS CID to pin
 * @param name - Optional name for the content
 * @returns Success status
 */
export async function pinByHash(cid: string, name?: string): Promise<boolean> {
  try {
    // Remove ipfs:// prefix if present
    const cleanCid = cid.startsWith('ipfs://') ? cid.replace('ipfs://', '') : cid;
    
    // Prepare metadata if name is provided
    const metadata = name ? {
      name,
      keyvalues: {
        source: 'study-marketplace',
        timestamp: Date.now()
      }
    } : undefined;
    
    // Make API request to Pinata
    await axios.post(
      `${PINATA_API_URL}/pinning/pinByHash`,
      {
        hashToPin: cleanCid,
        pinataMetadata: metadata
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error pinning hash to IPFS:', error);
    return false;
  }
}

/**
 * Lists pins from Pinata
 * 
 * @param status - Optional status filter (all, pinned, unpinned)
 * @param limit - Optional limit for number of results
 * @returns Array of pins
 */
export async function listPins(status: 'all' | 'pinned' | 'unpinned' = 'all', limit: number = 10): Promise<any[]> {
  try {
    const response = await axios.get(
      `${PINATA_API_URL}/pinning/pinList?status=${status}&pageLimit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    return response.data.rows;
  } catch (error) {
    console.error('Error listing pins:', error);
    return [];
  }
}

/**
 * Validates if a string is a valid IPFS CID
 * 
 * @param cid - The CID to validate
 * @returns Whether the CID is valid
 */
export function isValidIPFSCid(cid: string): boolean {
  // Remove ipfs:// prefix if present
  const cleanCid = cid.startsWith('ipfs://') ? cid.replace('ipfs://', '') : cid;
  
  // Check if the CID matches common IPFS CID patterns
  return (
    /^[a-zA-Z0-9]{46,59}$/.test(cleanCid) || 
    /^Qm[a-zA-Z0-9]{44}$/.test(cleanCid) || 
    /^bafy[a-zA-Z0-9]{52}$/.test(cleanCid)
  );
}

/**
 * Gets the gateway URL for an IPFS CID
 * 
 * @param cid - The IPFS CID
 * @returns The gateway URL
 */
export function getIPFSGatewayUrl(cid: string): string {
  // Remove ipfs:// prefix if present
  const cleanCid = cid.startsWith('ipfs://') ? cid.replace('ipfs://', '') : cid;
  return `${PINATA_GATEWAY}${cleanCid}`;
}

/**
 * Fetches content from IPFS using the gateway URL
 * 
 * @param cid - The IPFS CID
 * @returns The content as a blob
 */
export async function fetchFromIPFS(cid: string): Promise<Blob> {
  try {
    // Get the gateway URL
    const gatewayUrl = getIPFSGatewayUrl(cid);
    
    // Fetch the content
    const response = await fetch(gatewayUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from IPFS: ${response.status} ${response.statusText}`);
    }
    
    // Get the content as a blob
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch content from IPFS');
  }
} 