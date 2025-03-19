import fs from "fs";
import { OpenAI } from "openai";
import path from 'path';
// Initialize OpenAI client
const client = new OpenAI();

export async function POST(req: Request) {
  try {
    const { prompt, model, filePath, temperature = 0.9, max_tokens = 500, systemMessage } = await req.json();
    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received filePath:", filePath);
    console.log("Received systemMessage:", systemMessage);
    console.log("Received prompt:", prompt);

    // Default model to 'gpt-4' if not specified
    const modelName = model || "gpt-4";

    // Initialize result variable outside of the conditional blocks
    let result = null;

    // If filePath is provided, read the file
    if (filePath) {
      const absolutePath = path.join(process.cwd(), 'public', filePath);
      const fileBuffer = fs.createReadStream(absolutePath);

      // Upload file to OpenAI
      const fileUploadResponse = await client.files.create({
        file: fileBuffer,
        purpose: "user_data", // Modify the purpose as needed
      });

      console.log("Uploaded file with ID:", fileUploadResponse.id);

      result = await client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "file",
                file: {
                  file_id: fileUploadResponse.id,
                },
              },
            ],
          },
          {
            role: "assistant", 
            content: [
              {
                type: "text",
                text: systemMessage
              }
            ] },
        ],
        temperature,    // Pass the temperature parameter
        max_tokens,     // Pass the max_tokens parameter
      });
    } else {
      result = await client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
            ],
          },
          { role: "assistant", content: systemMessage },
        ],
        temperature,    // Pass the temperature parameter
        max_tokens,     // Pass the max_tokens parameter
      });
    }

    // Check if result and choices are valid before accessing
    if (result && result.choices && result.choices.length > 0) {
      console.log("🟢 OpenAI Generated Response:", result.choices[0].message.content);
      return Response.json({ text: result.choices[0].message.content });
    } else {
      console.error("No valid choices returned from OpenAI.");
      return Response.json({ error: "Failed to generate valid response from OpenAI" }, { status: 500 });
    }
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return Response.json({ error: "Failed to generate text with OpenAI" }, { status: 500 });
  }
}
