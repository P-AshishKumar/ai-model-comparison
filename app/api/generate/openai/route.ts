import fs from "fs";
import { OpenAI } from "openai";

// Initialize OpenAI client
const client = new OpenAI();

export async function POST(req: Request) {
  try {
    const { prompt, model, filePath, temperature = 0.9, max_tokens = 500 } = await req.json();
    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received filePath:", filePath);

    // Default model to 'gpt-4' if not specified
    const modelName = model || "gpt-4";

    // If filePath is provided, read the file
    let fileMessage = null;
    if (filePath) {
      const fileBuffer = fs.createReadStream(filePath);

      // Upload file to OpenAI
      const fileUploadResponse = await client.files.create({
        file: fileBuffer,
        purpose: "user_data", // Modify the purpose as needed
      });

      // Create a file message with the file data and the file ID
      fileMessage = {
        type: "file",
        file: {
          file_id: fileUploadResponse.id,
        },
      };
      console.log("Uploaded file with ID:", fileUploadResponse.id);
    }

    // Prepare the messages array, including the file if present
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          fileMessage,  // Include the file message if it exists
        ],
      },
    ];

    // Generate text based on the provided prompt, file, temperature, and max_tokens
    const result = await client.chat.completions.create({
      model: modelName,
      messages,
      temperature,    // Pass the temperature parameter
      max_tokens,     // Pass the max_tokens parameter
    });

    console.log("🟢 OpenAI Generated Response:", result.choices[0].message.content);

    return Response.json({ text: result.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return Response.json({ error: "Failed to generate text with OpenAI" }, { status: 500 });
  }
}
