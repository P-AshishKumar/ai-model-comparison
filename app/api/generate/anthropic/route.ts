import { Anthropic } from '@anthropic-ai/sdk';
import { generateText } from "ai";
import fs from "fs";
import path from "path";

// Define the types for the message contents.
interface TextContent {
  type: "text";
  text: string;
}

interface DocumentContent {
  type: "document";
  source: {
    type: "base64";
    media_type: "application/pdf";
    data: string;
  };
}

type MessageContent = TextContent | DocumentContent;

interface Message {
  role: "user" | "assistant" | "system";
  content: MessageContent[];
}

export async function POST(req: Request) {
  try {
    const requestBody = await req.json();
    const { 
      prompt, 
      model, 
      temperature = 0.9, 
      tokens = 500, 
      filePath, 
      systemMessage,
      apiKey // Get API key from request body 
    } = requestBody;

    // Try to get API key from header if not in the body
    const headerApiKey = req.headers.get('X-API-KEY');
    
    // Use the provided key, or fall back to environment variable
    const finalApiKey = apiKey || headerApiKey || process.env.ANTHROPIC_API_KEY;
    
    if (apiKey || headerApiKey) {
      console.log("Using user-provided Anthropic API key");
    }

    console.log("Received systemMessage:", systemMessage);
    // Ensure the 'model' field is provided
    if (!model) {
      console.error("❌ ERROR: Missing 'model' field in the request body.");
      return new Response(JSON.stringify({ error: "Missing 'model' field" }), { status: 400 });
    }

    // Ensure API Key is available
    if (!finalApiKey) {
      console.error("❌ ERROR: Missing Anthropic API Key. Ensure ANTHROPIC_API_KEY is set or provided with the request.");
      return new Response(JSON.stringify({ error: "Missing API Key" }), { status: 500 });
    }

    // Prepare messages array
    const messages: Message[] = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt }
        ],
      },
    ];

    // If filePath is provided, read and encode the file
    if (filePath) {
      try {
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        const fileContent = fs.readFileSync(absolutePath);
        const fileBase64 = fileContent.toString("base64");
        messages[0].content.push({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf", // Adjust MIME type if necessary
            data: fileBase64,
          },
        });
      } catch (error) {
        console.error("❌ ERROR: Failed to read or encode file at", filePath, error);
        return new Response(JSON.stringify({ error: "Failed to process file" }), { status: 500 });
      }
    }

    // Create Anthropic client with the appropriate API key
    const anthropic = new Anthropic({ 
      apiKey: finalApiKey 
    });

    // Make API request
    const response = await anthropic.messages.create({
      model: model, // Use the provided model
      system: systemMessage,
      messages: messages,
      max_tokens: tokens,
      temperature,
    });

    // Return the generated response
    console.log("🟢 Anthropic Generated Response:", response.content[0]?.text);
    return new Response(JSON.stringify({ text: response.content[0]?.text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred during processing", 
        details: error instanceof Error ? error.message : String(error)
      }), 
      { status: 500 }
    );
  }
}
