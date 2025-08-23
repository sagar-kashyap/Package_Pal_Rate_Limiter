
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from "./constants"; // Assuming constants are also needed backend side
import dotenv from 'dotenv';
dotenv.config();
// Define PackageSuggestion type for backend use, mirrors frontend
interface PackageSuggestion {
  name: string;
  description: string;
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
    For each package, provide its name and a brief one-sentence description of its primary purpose.
    Format the output as a JSON array of objects, where each object has "name" (string) and "description" (string) keys. For example:
    [
      {"name": "PackageA", "description": "Description of PackageA."},
      {"name": "PackageB", "description": "Description of PackageB."}
    ]
    If you cannot find any relevant packages or are unsure, return an empty JSON array [].
  `;

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
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
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
    console.error("Error calling Gemini API or parsing response in backend:", error);
    if (error instanceof Error) {
        // More specific error handling could be added here based on Gemini API error types
        throw new Error(`Failed to fetch package suggestions from Gemini: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching package suggestions from Gemini.");
  }
};
