import { google } from '@ai-sdk/google';
import { generateText } from "ai";
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { prompt, model, filePath, temperature = 0.9, max_tokens = 500, systemMessage, apiKey } = await req.json();
    
    // Try to get API key from header if not in the body
    const headerApiKey = req.headers.get('X-API-KEY');
    
    // Use the provided key, or fall back to environment variable
    const finalApiKey = apiKey || headerApiKey || process.env.GOOGLE_API_KEY;
    
    if (apiKey || headerApiKey) {
      console.log("Using user-provided Google API key");
      console.log(finalApiKey)
    }

   
    
    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received filePath:", filePath);
    console.log("Received systemMessage:", systemMessage);
    console.log("Received prompt:", prompt);

    // Default model to the provided model or a default if missing
    const modelName = model;

    // Prepare the messages array
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,  // Text content (prompt)
          },
        ].filter(Boolean), // Filters out any null values
      },
    ];

    // const modelInstance = google(modelName, {
      
    // });

    // process.env.MY_VARIABLE = 'some_value';

    // Generate text based on the provided prompt, file, temperature, and max_tokens
    const result = await generateText({
      model: google(modelName),
      system: systemMessage,
      apiKey: finalApiKey,
      messages,
      temperature,
      max_tokens,
    });

    console.log("🟢 Gemini Generated Response:", result.text);

    return new Response(JSON.stringify({ text: result.text }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("❌ Gemini Generation Error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate text with Gemini", 
      details: error instanceof Error ? error.message : String(error) 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
