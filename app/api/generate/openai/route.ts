import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
require('dotenv').config();
import { getUserApiKeys } from '@/lib/api-key-service';
import { getServerSession } from 'next-auth/next'; // If using NextAuth, otherwise use your session logic

export async function POST(req) {
  try {
    // First try to get the API key from the request
    const { prompt, model, document_data, temperature = 0.9, max_tokens = 500, systemMessage, apiKey } = await req.json();
    
    // Try the header if not in the body
    const headerApiKey = req.headers.get('X-API-KEY');
    
    // Use the provided key, or fall back to environment variable
    let finalApiKey = apiKey || headerApiKey || process.env.OPENAI_API_KEY;
    
    if( apiKey || headerApiKey){
      console.log("Setting up User Open AI API key")
    }
    
    // Initialize OpenAI client with the selected API key
    const client = new OpenAI({
      apiKey: finalApiKey
    });

    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received document_data:", document_data);
    console.log("Received systemMessage:", systemMessage);
    console.log("Received prompt:", prompt);

    let result = null;

    // If filePath is provided, upload the file
    if (document_data) {
      console.log('with document data...');
      result = await client.chat.completions.create({
        model: model || "gpt-4",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: document_data + prompt,
              }
            ],
          },
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: systemMessage || '',
              }
            ],
          },
        ],
        temperature,
        max_tokens,
      });
    } else {
      console.log('Making OpenAI request without file upload...');
      result = await client.chat.completions.create({
        model: model || "gpt-4",
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
          {
            role: "assistant",
            content: [
              {
                type: "text",
                text: systemMessage || '',
              }
            ],
          },
        ],
        temperature,
        max_tokens,
      });
    }

    const answer = result.choices[0].message.content;

    console.log("🟢 Opem AI Generated Response:", answer);
    return Response.json({ text: answer });

  } catch (error) {
    console.error('Error during OpenAI request or caching:', error);
    return Response.json({ error: 'Failed to generate text with OpenAI or fetch from cache' }, { status: 500 });
  }
};
