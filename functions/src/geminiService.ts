
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from "./constants"; // Assuming constants are also needed backend side
import dotenv from 'dotenv';
dotenv.config();
// Define PackageSuggestion type for backend use, mirrors frontend
interface PackageSuggestion {
  name: string;
  description: string;
  url?: string;
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable not set for backend. Gemini API calls will fail.");
}

// Initialize AI client. If API_KEY is missing, calls will fail but server won't crash on init.
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY_BACKEND" });

export const findSimilarPackagesInBackend = async (
  sourcePackage: string,
  sourceLang: string,
  targetLang: string
): Promise<PackageSuggestion[]> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured on the server.");
  }

  const prompt = `
    I am looking for packages in ${targetLang} that are similar in functionality to the ${sourceLang} package named "${sourcePackage}".
    Please provide a list of up to 5 such packages, ordered from most relevant to least relevant.
    For each package, include its name, a brief one-sentence description of its primary purpose, and a direct URL to its official documentation or package manager page (like npmjs.com, pypi.org, pkg.go.dev).
    Format the output as a JSON array of objects, where each object has "name" (string), "description" (string) and "url" (string) keys. For example:
    [
      {"name": "PackageA", "description": "Description of PackageA.", "url": "url of PackageA official documentation or package manager page"},
      {"name": "PackageB", "description": "Description of PackageB.", "url": "url of PackageB official documentation or package manager page"}
    ]
    If you cannot find any relevant packages or are unsure, return an empty JSON array [].
  `;
  const MAX_RETRIES = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, 
      },
    });

    if (!response.text) {
      throw new Error("Gemini API response did not contain any text.");
    }
    let jsonStr = response.text.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?([\s\S]*?)\n?\s*```$/;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (Array.isArray(parsedData)) {
      return parsedData.filter(
        (item: any): item is PackageSuggestion =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.name === 'string' &&
          typeof item.description === 'string'
      ).slice(0, 5); // Ensure max 5 results
    }
    
    console.warn("Gemini response was not a valid array:", parsedData);
    return [];

  } catch (error) {
      console.error(`Error on attempt ${attempt} calling Gemini API:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      const errorMessage = lastError.message;
      const isRetryable = errorMessage.includes('503') || 
                          errorMessage.includes('UNAVAILABLE') || 
                          errorMessage.includes('overloaded');

      if (isRetryable && attempt < MAX_RETRIES) {
        // Exponential backoff with jitter: 1s, 2s, 4s...
        const delay = Math.pow(2, attempt - 1) * 1000 + Math.random() * 1000;
        console.log(`Model overloaded. Retrying in ${delay.toFixed(0)}ms... (Attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Not a retryable error or max retries reached, so stop trying
        break;
      }
    }
  }

  // If the loop finished because of an error, throw a more informative error.
  if (lastError) {
    throw new Error(`Failed to fetch package suggestions from Gemini after ${MAX_RETRIES} attempts: ${lastError.message}`);
  }
  
  // Fallback in case loop exits unexpectedly without success or a captured error
  throw new Error("An unknown error occurred while fetching package suggestions from Gemini.");
};