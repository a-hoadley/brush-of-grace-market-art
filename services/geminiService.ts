
import { GoogleGenAI, Type } from "@google/genai";
import type { EstimationResult } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY || API_KEY === 'PLACEHOLDER_API_KEY') {
  throw new Error("Please set a valid GEMINI_API_KEY in your .env.local file. Get your API key from https://aistudio.google.com/app/apikey");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Converts a File object to a format suitable for Google Gemini AI
 * @param file The image file to convert
 * @returns Promise resolving to generative part object with base64 data
 */
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

/**
 * Gets market value estimation for an item using Google Gemini AI
 * @param imageFile The image file of the item to analyze
 * @param zipCode The 5-digit zip code for local market analysis
 * @returns Promise resolving to estimation result with price, confidence, and reasoning
 * @throws Error if API key is invalid, quota exceeded, or other API errors occur
 */
export const getMarketValueEstimation = async (imageFile: File, zipCode: string): Promise<EstimationResult> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const textPart = {
        text: `Analyze the item in this image. Based on its apparent condition and features, and considering the local market dynamics of zip code ${zipCode}, estimate its resale value on platforms like Facebook Marketplace or Craigslist.`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  itemName: {
                      type: Type.STRING,
                      description: "The name of the item identified in the image (e.g., 'Vintage Leather Armchair', 'Used Mountain Bike').",
                  },
                  estimatedPrice: {
                      type: Type.INTEGER,
                      description: "Your best single-point estimate for the local selling price in USD. Do not include currency symbols.",
                  },
                  priceRange: {
                      type: Type.STRING,
                      description: "A likely price range for the item, formatted as '$min - $max'.",
                  },
                  confidence: {
                      type: Type.STRING,
                      description: "Your confidence level in this estimate: High, Medium, or Low.",
                      enum: ['High', 'Medium', 'Low'],
                  },
                  reasoning: {
                      type: Type.STRING,
                      description: "A detailed but concise explanation for your valuation. Mention the item's condition, brand (if identifiable), and how the zip code might influence the price.",
                  },
              },
              required: ["itemName", "estimatedPrice", "priceRange", "confidence", "reasoning"],
          },
      },
    });

    const rawText = response.text.trim();
    
    try {
      const parsedJson = JSON.parse(rawText);
      return parsedJson as EstimationResult;
    } catch (e) {
      console.error("Failed to parse JSON response:", rawText);
      throw new Error("The AI returned an unexpected response format. Please try again.");
    }
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw known errors
      if (error.message.includes('API_KEY') || error.message.includes('GEMINI_API_KEY')) {
        throw error;
      }
      // Handle API errors
      if (error.message.includes('API key')) {
        throw new Error("Invalid API key. Please check your Gemini API key in the .env.local file.");
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error("API quota exceeded. Please try again later or check your Gemini API usage limits.");
      }
      // Generic API error
      throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while processing your request. Please try again.");
  }
};
