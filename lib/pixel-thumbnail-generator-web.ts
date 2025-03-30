/**
 * Web-Enhanced 8-bit Pixel Thumbnail Generator
 * 
 * This utility creates unique 8-bit style thumbnails based on the title and category of materials.
 * It can search the web for relevant imagery and convert it into pixel art.
 */

import { getSubjectThumbnail } from './thumbnails';
import { COLOR_PALETTES, DEFAULT_PALETTE, simpleHash, generatePixelGrid, gridToSVG } from './pixel-thumbnail-generator';

// API endpoint for image search
const SEARCH_API_URL = 'https://api.unsplash.com/search/photos';
const PIXABAY_API_URL = 'https://pixabay.com/api/';
// Use environment variables for API keys in production
const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY || '';
const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY || '';

/**
 * Search for images related to a topic
 * @param query The search query
 * @returns URL of a relevant image or null if none found
 */
export async function searchTopicImage(query: string, category: string): Promise<string | null> {
  try {
    // Try Unsplash API first
    if (UNSPLASH_API_KEY) {
      const searchQuery = `${query} ${category}`;
      const response = await fetch(`${SEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}&per_page=1`, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
        }
      });
      
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.small;
      }
    }
    
    // Fall back to Pixabay if Unsplash fails or has no key
    if (PIXABAY_API_KEY) {
      const searchQuery = `${query} ${category}`;
      const response = await fetch(`${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&per_page=3`);
      
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return data.hits[0].webformatURL;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error searching for topic image:', error);
    return null;
  }
}

/**
 * Convert an image to pixel art using canvas
 * @param imageUrl URL of the image to convert
 * @param category Category for color palette
 * @returns A promise that resolves to a data URL of the pixelated image
 */
export async function convertToPixelArt(imageUrl: string, category: string): Promise<string> {
  // This would normally be done on the client-side with a canvas
  // For serverless or SSR environments, we'd need a different approach
  if (typeof window === 'undefined') {
    // Return a deterministic placeholder when not in browser
    return generatePixelThumbnail(imageUrl, category);
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Create a canvas for pixelation
      const canvas = document.createElement('canvas');
      const pixelSize = 8; // 8x8 grid
      canvas.width = pixelSize * 8;
      canvas.height = pixelSize * 8;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Resize and draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Get the palette for the category
      const normalizedCategory = category.toLowerCase().trim();
      const palette = COLOR_PALETTES[normalizedCategory] || DEFAULT_PALETTE;
      
      // Convert each pixel to the nearest color in our palette
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Find the closest color in the palette
        const hexColor = findClosestColor(r, g, b, palette);
        
        // Convert hex back to RGB
        const rgb = hexToRgb(hexColor);
        
        // Update the pixel
        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
      }
      
      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Create a larger canvas for the final output
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = 400;
      outputCanvas.height = 400;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) {
        reject(new Error('Could not get output canvas context'));
        return;
      }
      
      // Draw pixelated version
      outputCtx.imageSmoothingEnabled = false;
      outputCtx.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height);
      
      // Convert to data URL
      resolve(outputCanvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      // Fall back to the original algorithm on error
      resolve(generatePixelThumbnail(imageUrl, category));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Find the closest color in a palette to the given RGB values
 * @param r Red value
 * @param g Green value
 * @param b Blue value
 * @param palette Array of hex color strings
 * @returns The closest hex color
 */
function findClosestColor(r: number, g: number, b: number, palette: string[]): string {
  let minDistance = Infinity;
  let closestColor = palette[0];
  
  for (const hexColor of palette) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) continue;
    
    const distance = Math.sqrt(
      Math.pow(r - rgb.r, 2) +
      Math.pow(g - rgb.g, 2) +
      Math.pow(b - rgb.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = hexColor;
    }
  }
  
  return closestColor;
}

/**
 * Convert a hex color to RGB
 * @param hex Hex color string
 * @returns RGB object or null if invalid
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get a pixel art thumbnail for a topic by searching the web
 * @param title The title/topic to search for
 * @param category The category
 * @returns A data URL with the pixel art thumbnail
 */
export async function getWebBasedPixelThumbnail(title: string, category: string): Promise<string> {
  try {
    // Search for an image related to the topic
    const imageUrl = await searchTopicImage(title, category);
    
    if (imageUrl) {
      // Convert the image to pixel art
      return await convertToPixelArt(imageUrl, category);
    }
    
    // Fall back to the original algorithm if no image is found
    return generatePixelThumbnail(title, category);
  } catch (error) {
    console.error('Error generating web-based pixel thumbnail:', error);
    // Fall back to the original algorithm on error
    return generatePixelThumbnail(title, category);
  }
}

/**
 * Generate a base64 data URL for an 8-bit style thumbnail
 * This is the same as in the original file, to maintain backward compatibility
 * @param title The title of the material
 * @param category The category of the material
 * @returns A data URL containing the SVG thumbnail
 */
export function generatePixelThumbnail(title: string, category: string): string {
  // Get the appropriate color palette
  const normalizedCategory = category.toLowerCase().trim();
  const palette = COLOR_PALETTES[normalizedCategory] || DEFAULT_PALETTE;
  
  // Generate the pixel grid
  const grid = generatePixelGrid(title, category);
  
  // Convert to SVG
  const svg = gridToSVG(grid, palette);
  
  // Convert to data URL
  const dataURL = `data:image/svg+xml;base64,${btoa(svg)}`;
  
  return dataURL;
}

/**
 * Generates a server-side compatible pixel art SVG
 * @param title The title of the material
 * @param category The category of the material
 * @returns SVG string
 */
export function generateServerPixelArt(title: string, category: string): string {
  const normalizedCategory = category.toLowerCase().trim();
  const palette = COLOR_PALETTES[normalizedCategory] || DEFAULT_PALETTE;
  
  // Generate a deterministic grid based on the title
  const grid = generatePixelGrid(title, category);
  
  // Convert to SVG
  return gridToSVG(grid, palette);
} 