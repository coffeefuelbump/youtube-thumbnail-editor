import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Edits an image using a text prompt and an optional context image with the Gemini 2.5 Flash Image model.
 * @param baseImage The base image to be edited.
 * @param prompt The text prompt describing the desired edit.
 * @param contextImage An optional image providing context for the edit.
 * @returns A promise that resolves to the base64 encoded string and MIME type of the edited image.
 */
export const editImage = async (
  baseImage: { base64: string; mimeType: string },
  prompt: string,
  contextImage?: { base64: string; mimeType: string }
): Promise<{ newBase64: string; newMimeType: string }> => {
  try {
    const parts: any[] = [
      {
        inlineData: {
          data: baseImage.base64,
          mimeType: baseImage.mimeType,
        },
      },
    ];

    if (contextImage) {
      parts.push({
        inlineData: {
          data: contextImage.base64,
          mimeType: contextImage.mimeType,
        },
      });
    }
    
    parts.push({ text: prompt });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return {
        newBase64: imagePart.inlineData.data,
        newMimeType: imagePart.inlineData.mimeType,
      };
    } else {
      throw new Error("API response did not contain an image.");
    }
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    if(error instanceof Error) {
        throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while editing the image.");
  }
};
