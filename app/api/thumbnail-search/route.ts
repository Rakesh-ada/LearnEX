import { NextRequest, NextResponse } from 'next/server';
import { generatePixelThumbnail } from '@/lib/pixel-thumbnail-generator';

export const dynamic = 'force-dynamic';

/**
 * API route to search for images and convert them to 8-bit thumbnails
 * This is a simulation for demonstration purposes
 * In a production environment, this would connect to actual image search APIs
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic');
    const category = searchParams.get('category') || 'other';
    
    // Validate input
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // In a real implementation, we would:
    // 1. Call external APIs like Unsplash or Pixabay to search for images
    // 2. Process the best matching image into pixel art
    // 3. Return a URL to the processed image
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, use our existing thumbnail generator
    // but add some randomness to simulate different web results
    const thumbnailUrl = generatePixelThumbnail(
      `${topic}-${Math.random().toString(36).substring(2, 7)}`,
      category
    );
    
    return NextResponse.json({
      success: true,
      thumbnailUrl,
      metadata: {
        topic,
        category,
        source: 'web-search-simulation',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in thumbnail search API:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { topic, category = 'other' } = body;
    
    // Validate input
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes, use our existing thumbnail generator
    // but add some randomness to simulate different web results
    const thumbnailUrl = generatePixelThumbnail(
      `${topic}-${Math.random().toString(36).substring(2, 7)}`,
      category
    );
    
    return NextResponse.json({
      success: true,
      thumbnailUrl,
      metadata: {
        topic,
        category,
        source: 'web-search-simulation',
        method: 'POST',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error in thumbnail search API:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
} 