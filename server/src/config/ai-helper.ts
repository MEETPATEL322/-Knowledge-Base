import axios from "axios";
import { config } from "./config";

const GEMINI_API_KEY = config.ai_key;

export async function generateGeminiAnswer(question: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return output?.trim() || "No response from Gemini.";
  } catch (error: any) {
    console.error("Gemini error:", error.response?.data || error.message);
    throw error;
  }
}
