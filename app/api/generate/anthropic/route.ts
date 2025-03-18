import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    console.log("📩 Incoming Request:");
    // console.log("➡️ Method:", req.method);
    // console.log("📝 Headers:", Object.fromEntries(req.headers.entries()));

    const requestBody = await req.json();
    console.log("📦 Request Body:", requestBody);

    const { prompt, model } = requestBody;

    // Ensure model is properly handled
    const modelName = model

    // Ensure API Key is loaded
    const api_key = process.env.ANTHROPIC_API_KEY;
    if (!api_key) {
      console.error("❌ ERROR: Missing Anthropic API Key. Make sure ANTHROPIC_API_KEY is set in .env.local");
      return Response.json({ error: "Missing API Key" }, { status: 500 });
    }

    console.log("✅ API Key Loaded");

    const result = await generateText({
      model: anthropic(modelName, { apiKey: api_key }),
      prompt,
      system:
        "You are a helpful AI assistant powered by Anthropic's Claude. Provide clear, concise, and accurate responses.",
    });

    console.log("🟢 Generated Response:", result.text);

    return Response.json({ text: result.text });
  } catch (error) {
    console.error("❌ Anthropic Generation Error:", error);
    return Response.json({ error: "Failed to generate text with Anthropic" }, { status: 500 });
  }
}
