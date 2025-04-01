import { NextRequest, NextResponse } from 'next/server';
import { isValidIPFSCid, fetchFromIPFS } from '@/lib/pinning-service';

/**
 * Secure Content Proxy API
 * This API acts as a proxy to serve IPFS content without exposing the underlying CID.
 * It uses a token-based system for security and proper access control.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get the token from query params
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      );
    }
    
    // Token structure: base64-encoded JSON with contentHash and expiry
    let decodedData;
    try {
      decodedData = JSON.parse(atob(token));
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }
    
    const { contentHash, expiry, type } = decodedData;
    
    // Validate token expiry
    if (expiry && new Date(expiry).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }
    
    // Validate content hash format
    if (!contentHash || !isValidIPFSCid(contentHash)) {
      return NextResponse.json(
        { error: 'Invalid content identifier' },
        { status: 400 }
      );
    }
    
    // Fetch the content from IPFS
    const contentBlob = await fetchFromIPFS(contentHash);
    
    // Determine content type
    let contentType = 'application/octet-stream'; // Default
    
    if (type === 'pdf') {
      contentType = 'application/pdf';
    } else if (type === 'video') {
      contentType = 'video/mp4';
    }
    
    // Convert Blob to ArrayBuffer for the response
    const arrayBuffer = await contentBlob.arrayBuffer();
    
    // Return the content with appropriate headers
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline', // For browser display
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error serving secure content:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve content' },
      { status: 500 }
    );
  }
} 