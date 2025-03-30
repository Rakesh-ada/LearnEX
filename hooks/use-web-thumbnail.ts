import { useState, useEffect } from 'react';
import { generatePixelThumbnail } from '@/lib/pixel-thumbnail-generator';

interface WebThumbnailResult {
  thumbnailUrl: string;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to generate a thumbnail based on web search results
 * @param topic The topic to search for
 * @param category The category for color theming
 * @returns An object containing the thumbnail URL, loading state, and any error
 */
export function useWebThumbnail(topic: string, category: string): WebThumbnailResult {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!topic) return;

    // Reset state when topic or category changes
    setIsLoading(true);
    setError(null);

    // Call the API to generate a web-based thumbnail
    const generateThumbnail = async () => {
      try {
        // Call our API endpoint
        const response = await fetch(
          `/api/thumbnail-search?topic=${encodeURIComponent(topic)}&category=${encodeURIComponent(category)}`
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        setThumbnailUrl(data.thumbnailUrl);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching thumbnail:', err);
        setError(err instanceof Error ? err : new Error('Failed to generate thumbnail'));
        setIsLoading(false);
        
        // Fallback to the standard thumbnail generator on error
        setThumbnailUrl(generatePixelThumbnail(topic, category));
      }
    };

    generateThumbnail();
  }, [topic, category]);

  return { thumbnailUrl, isLoading, error };
}

/**
 * Hook that lazily generates a web thumbnail only when triggered
 * @returns An object with the thumbnail URL, loading state, error, and a generate function
 */
export function useLazyWebThumbnail() {
  const [topic, setTopic] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const generateThumbnail = async (newTopic: string, newCategory: string) => {
    if (!newTopic) return;

    setTopic(newTopic);
    setCategory(newCategory);
    setIsLoading(true);
    setError(null);

    try {
      // Call our API endpoint using POST
      const response = await fetch('/api/thumbnail-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: newTopic,
          category: newCategory,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setThumbnailUrl(data.thumbnailUrl);
      setIsLoading(false);
      return data.thumbnailUrl;
    } catch (err) {
      console.error('Error generating thumbnail:', err);
      const error = err instanceof Error ? err : new Error('Failed to generate thumbnail');
      setError(error);
      setIsLoading(false);
      
      // Fallback to standard thumbnail generator
      const fallbackUrl = generatePixelThumbnail(newTopic, newCategory);
      setThumbnailUrl(fallbackUrl);
      throw error;
    }
  };

  return {
    thumbnailUrl,
    isLoading,
    error,
    generateThumbnail,
    topic,
    category
  };
} 