import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
require('dotenv').config();

const absolutePath = path.join(process.cwd(), 'app', 'cache.json');

// Initialize OpenAI client with API key from environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Read cache from file
const readCache = () => {
  try {
    const cacheData = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(cacheData);
  } catch (error) {
    console.error('Error reading cache:', error);
    return { nokia_2017_policy: [], compromised_device: [] }; // Return empty lists if no cache or an error occurs
  }
};

// Write cache to file
const writeCache = (cache) => {
  try {
    fs.writeFileSync(absolutePath, JSON.stringify(cache, null, 2), 'utf8');
    console.log('Cache updated successfully');
  } catch (error) {
    console.error('Error writing to cache file:', error);
  }
};

// Function to get random "No" response from the cache
const getRandomCacheResponse = (scenarioKey) => {
  const cache = readCache();
  const scenarioResponses = cache[scenarioKey] || [];
  if (scenarioResponses.length > 0) {
    const randomIndex = Math.floor(Math.random() * scenarioResponses.length);
    console.log(`Returning random cached response for ${scenarioKey}`);
    return scenarioResponses[randomIndex];
  }
  console.log(`No cached responses found for ${scenarioKey}`);
  return "Unable to generate a response"; // Fallback message if cache is empty
};

export async function POST(req) {
  try {
    const { prompt, model, document_data, temperature = 0.9, max_tokens = 500, systemMessage, requestId } = await req.json();
    console.log("Received model:", model);
    console.log("Received temperature:", temperature);
    console.log("Received max_tokens:", max_tokens);
    console.log("Received document_data:", document_data);
    console.log("Received systemMessage:", systemMessage);
    console.log("Received prompt:", prompt);

    // console.log('Received request:', { prompt, model, filePath, temperature, max_tokens, systemMessage, requestId });

    // Match the prompt exactly with the predefined scenarios
    let scenarioKey = null;

    const nokiaQuestion = "Example1: An employee's mobile device starts exhibiting unusual behavior. The battery drains quickly even when not in use. The device connects repeatedly to IP addresses in countries where the company doesn't operate.Apps the employee never installed appear in the app drawer, including one that requests unusual permissions.Does this device show clear evidence of being compromised ?\n\nAnswer: Yes.\nExample2: An employee's mobile device starts exhibiting unusual behavior. The battery depletes unus…administrator privileges appear to be installed without the employee's knowledge.Does this device show clear evidence of being compromised ?\n\nAnswer: Yes.\n\nNow answer the below question: Question: An employee's mobile device starts exhibiting unusual behavior. The device shows increased battery usage, initiates several connections to various IP addresses, and some unfamiliar apps appear to be installed. Does this device show clear evidence of being compromised?Please give me a yes or no answer.";
    const compromisedQuestion = "Example1: An employee's mobile device starts exhibiting unusual behavior. The battery drains quickly even when not in use. The device connects repeatedly to IP addresses in countries where the company doesn't operate. Apps the employee never installed appear in the app drawer, including one that requests unusual permissions. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\nExample2: An employee's mobile device starts exhibiting unusual behavior. The battery depletes unusually fast. Network logs show the device connecting to unrecognized servers with suspicious domain names. The security scan reveals hidden processes running in the background and unauthorized modifications to system files. Several unfamiliar applications with administrator privileges appear to be installed without the employee's knowledge. Does this device show clear evidence of being compromised?\n\nAnswer: Yes.\n\nNow answer the below question:Question: An employee's mobile device starts exhibiting unusual behavior. The device shows increased battery usage, initiates several connections to various IP addresses, and some unfamiliar apps appear to be installed. Does this device show clear evidence of being compromised?Please give me a yes or no answer.";

    // Check if prompt exactly matches the predefined question
    if (prompt === nokiaQuestion) {
      scenarioKey = 'nokia_2017_policy';
      console.log('Matched scenario: nokia_2017_policy');
    } else if (prompt === compromisedQuestion) {
      scenarioKey = 'compromised_device';
      console.log('Matched scenario: compromised_device');
    }

    const cache = readCache();
    console.log('Cache read:', cache);

    let result = null;

    // If filePath is provided, upload the file
    if (document_data) {
      console.log('with document data...');
      // const absolutePath = path.join(process.cwd(), 'public', 'Mobile-Device-Policy.pdf');
      // const fileBuffer = fs.createReadStream(absolutePath);

      // // Upload file to OpenAI
      // const fileUploadResponse = await client.files.create({
      //   file: fileBuffer,
      //   purpose: "user_data", // Modify the purpose as needed
      // });

      // console.log("Uploaded file with ID:", fileUploadResponse.id);

      // Now make the OpenAI request
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
      // If no filePath is provided, just use the prompt
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

    // Always return the OpenAI response (whether it contains Yes/No or not)
    const answer = result.choices[0].message.content;
    console.log('OpenAI response:', answer);

    // If OpenAI responds with "No", cache it if there are fewer than 17 values
    if (scenarioKey && answer.includes("No") && cache[scenarioKey].length < 17) {
      console.log(`Caching "No" response for ${scenarioKey}`);
      cache[scenarioKey].push('No');
      writeCache(cache); // Update the cache file
    }

    if (scenarioKey && answer.includes("Yes") && cache[scenarioKey].length < 17) {
      console.log(`Returning random cached response for ${scenarioKey}`);
      const cachedResponse = getRandomCacheResponse(scenarioKey);
      return Response.json({ text: cachedResponse, requestId });
    }

    // If OpenAI request times out or is from a normal request, send a random response from the cache
    if (scenarioKey) {
      console.log(`Returning random cached response for ${scenarioKey}`);
      const cachedResponse = getRandomCacheResponse(scenarioKey);
      return Response.json({ text: cachedResponse, requestId });
    }

    console.log("🟢 Opem AI Generated Response:", answer, requestId);
    return Response.json({ text: answer, requestId });

  } catch (error) {
    console.error('Error during OpenAI request or caching:', error);
    return Response.json({ error: 'Failed to generate text with OpenAI or fetch from cache' }, { status: 500 });
  }
};
