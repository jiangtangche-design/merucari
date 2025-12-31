
import { GoogleGenAI } from "@google/genai";

export const optimizeDescription = async (title: string, currentDesc: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional e-commerce copywriter.
      Optimize the following product description to be more engaging and professional. 
      Keep it concise but attractive for sales.
      
      Product Title: ${title}
      Current Description: ${currentDesc}
      
      Return ONLY the optimized description text.`,
    });

    return response.text || currentDesc;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return currentDesc;
  }
};
