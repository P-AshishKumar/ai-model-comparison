import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming Request:");
    // console.log("➡️ Method:", req.method);
    // console.log("📝 Headers:", Object.fromEntries(req.headers.entries()));

    const requestBody = await req.json();
    console.log("📦 Request Body:", requestBody);

    const { prompt, model } = requestBody;

    // Fix: Ensure model is properly handled
    const modelName = model;

    // Fix: Ensure API Key is loaded (if required)
    const api_key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!api_key) {
      console.error("❌ ERROR: Missing Google API Key. Make sure GOOGLE_API_KEY is set in .env.local");
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    console.log("✅ API Key Loaded");

    const result = await generateText({
      model: google(modelName),
      prompt,
      system: "You are a helpful AI assistant powered by Google's Gemini model. Provide clear, concise, and accurate responses.",
    });

    console.log("🟢 Generated Response:", result.text);

    return new Response(JSON.stringify({ text: result.text }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ Gemini Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate text with Gemini" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
