
import { PackageSuggestion } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
// The backend server URL. Adjust if your backend runs on a different port or host.
const BACKEND_API_URL = `${process.env.SERVER_URL}/api`; // Assuming proxy setup or same domain

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

export const findSimilarPackagesWithUserKey = async (
  sourcePackage: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<PackageSuggestion[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `I am looking for packages in ${targetLang} that are similar in functionality to the ${sourceLang} package named "${sourcePackage}". Provide a list of up to 5 relevant packages. For each package, include its name, a brief one-sentence description, and a direct URL to its official documentation or package manager page (like npmjs.com, pypi.org, pkg.go.dev).`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the package.",
              },
              description: {
                type: Type.STRING,
                description: "A brief one-sentence description of the package's primary purpose.",
              },
               url: {
                type: Type.STRING,
                description: "The URL to the package's official documentation or package manager page (e.g., npmjs.com, pypi.org)."
              },
            },
            required: ["name", "description"],
          },
        },
      },
    });
    
    if (!response.text) {
      throw new Error("Gemini API response did not contain any text.");
    }
    const jsonStr = response.text.trim();
    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData)) {
       return parsedData.filter(
        (item: any): item is PackageSuggestion =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string' &&
          typeof item.description === 'string'
      ).slice(0, 5);
    }
    
    console.warn("Direct Gemini response was not a valid array:", parsedData);
    return [];
  } catch (error) {
    console.error("Error calling Gemini API directly:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch suggestions with your API key. Please check the key and try again. Details: ${error.message}`);
    }
    throw new Error("An unknown error occurred while using your API key.");
  }
};
