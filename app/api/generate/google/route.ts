import { google } from '@ai-sdk/google';
import { generateText } from "ai";
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { prompt, model, filePath, temperature = 0.9, max_tokens = 500 } = await req.json();
    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received filePath:", filePath);

    // Default model to the provided model or a default if missing
    const modelName = model;

    // If filePath is provided, read the file
    let fileMessage = null;
    if (filePath) {
      const absolutePath = path.resolve(filePath);

      // Read the file content
      const fileBuffer = fs.readFileSync(absolutePath);
      fileMessage = {
        type: 'file',
        data: fileBuffer,
        mimeType: 'application/pdf', // Set MIME type as per your file type
      };
    }

    // Prepare the messages array, including the file if present
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,  // Text content (prompt)
          },
          fileMessage,  // Include file if present, otherwise it will be null
        ].filter(Boolean), // Filters out any null values (e.g., if fileMessage is null)
      },
    ];

    // Generate text based on the provided prompt, file, temperature, and max_tokens
    const result = await generateText({
      model: google(modelName), // Passing the model
      messages, // The messages array that includes text and file
      temperature,
      max_tokens,
    });

    console.log("🟢 Gemini Generated Response:", result.text);

    return new Response(JSON.stringify({ text: result.text }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("❌ Gemini Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate text with Gemini" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
