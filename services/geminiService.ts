
import { GoogleGenAI } from "@google/genai";

// Always use named parameter for apiKey and ensure it is from process.env.API_KEY exclusively.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHealthInsight(vitalData: any) {
  try {
    // Generate content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the following blood pressure data (Systolic/Diastolic and Heart Rate) for the week: ${JSON.stringify(vitalData)}. 
      Provide a brief, professional health summary in 2 sentences. 
      Focus on stability and actionable minor advice like hydration or rest. 
      Do not give clinical diagnoses.`,
    });
    // Use the .text property directly as it is a getter.
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Maintain a balanced lifestyle and keep monitoring your vitals regularly.";
  }
}
