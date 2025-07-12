
import { PackageSuggestion } from '../types';

// The backend server URL. Adjust if your backend runs on a different port or host.
const BACKEND_API_URL = 'http://localhost:3001/api'; // Assuming proxy setup or same domain

export const findSimilarPackages = async (
  sourcePackage: string,
  sourceLang: string,
  targetLang: string
): Promise<PackageSuggestion[]> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/find-packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourcePackage, sourceLang, targetLang }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred with the backend.' }));
      // Check for specific rate limit status code if backend sends one (e.g., 429)
      if (response.status === 429) {
          throw new Error(errorData.message || 'Too many requests. Please try again later.');
      }
      throw new Error(errorData.message || `Backend request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.filter(
        (item: any): item is PackageSuggestion =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string' &&
          typeof item.description === 'string'
      ).slice(0, 5); // Ensure max 5 results, though backend should handle this
    }
    
    console.warn("Backend response was not a valid array:", data);
    return [];

  } catch (error) {
    console.error("Error fetching package suggestions from backend:", error);
    if (error instanceof Error) {
        throw new Error(`${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching package suggestions.");
  }
};