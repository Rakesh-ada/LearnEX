/**
 * Secure Content Utilities
 * These utilities help manage secure access to content without exposing sensitive information.
 */

/**
 * Generates a secure access token for content
 * The token is a base64-encoded JSON object containing the content hash and expiry time
 * 
 * @param contentHash - The IPFS content hash
 * @param type - The content type (pdf, video, etc.)
 * @param expiryMinutes - Optional expiry time in minutes (default: 60 minutes)
 * @returns The secure access token
 */
export function generateSecureToken(contentHash: string, type: string, expiryMinutes: number = 60): string {
  // Calculate expiry time
  const expiry = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();
  
  // Create token data
  const tokenData = {
    contentHash,
    type,
    expiry,
    // Add a random component to prevent token prediction
    nonce: Math.random().toString(36).substring(2, 15)
  };
  
  // Encode token as base64
  return btoa(JSON.stringify(tokenData));
}

/**
 * Generates a secure content URL using the secure content proxy API
 * 
 * @param contentHash - The IPFS content hash
 * @param type - The content type (pdf, video, etc.)
 * @param expiryMinutes - Optional expiry time in minutes (default: 60 minutes)
 * @returns The secure content URL
 */
export function getSecureContentUrl(contentHash: string, type: string, expiryMinutes: number = 60): string {
  const token = generateSecureToken(contentHash, type, expiryMinutes);
  return `/api/secure-content?token=${encodeURIComponent(token)}`;
} 