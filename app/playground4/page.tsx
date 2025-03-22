"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Key, Copy, Check, BookOpen, CheckCircle, ExternalLink, Github, FileText } from "lucide-react"
import MainNavbar from "@/components/MainNavbar"
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"
import { useApiStore } from "@/hooks/useApiStore" // Import the API store

// Add this helper function at the top level of your component
const maskApiKey = (key: string): string => {
  if (!key || key === "sk-..." || key === "AIza..." || key === "sk-ant-...") {
    return "Not configured";
  }
  // Only show first 4 and last 4 characters
  return key.length <= 8 
    ? "********" 
    : `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export default function Playground4Page() {
  const router = useRouter()
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  // Get API keys from the store
  const { apiKeys: storeApiKeys } = useApiStore()
  
  // API keys for the modal - use keys from store or fallback to placeholders
  const [apiKeys, setApiKeys] = useState([
    { name: "OPENAI_API_KEY", value: "sk-..." },
    { name: "GOOGLE_API_KEY", value: "AIza..." },
    { name: "ANTHROPIC_API_KEY", value: "sk-ant-..." }
  ])
  
  // Effect to update API keys when store changes
  useEffect(() => {
    if (storeApiKeys) {
      setApiKeys([
        { name: "OPENAI_API_KEY", value: storeApiKeys.openai_api_key || "sk-..." },
        { name: "GOOGLE_API_KEY", value: storeApiKeys.google_generative_ai_api_key || "AIza..." },
        { name: "ANTHROPIC_API_KEY", value: storeApiKeys.anthropic_api_key || "sk-ant-..." }
      ]);
    } else {
      // Try loading from localStorage as fallback
      try {
        const storedKeys = localStorage.getItem('apiKeys');
        if (storedKeys) {
          const parsedKeys = JSON.parse(storedKeys);
          setApiKeys([
            { name: "OPENAI_API_KEY", value: parsedKeys.openai_api_key || "sk-..." },
            { name: "GOOGLE_API_KEY", value: parsedKeys.google_generative_ai_api_key || "AIza..." },
            { name: "ANTHROPIC_API_KEY", value: parsedKeys.anthropic_api_key || "sk-ant-..." }
          ]);
        }
      } catch (error) {
        console.warn("Error loading API keys from localStorage:", error);
      }
    }
  }, [storeApiKeys]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Resources
  const resources = [
    // { name: "VS Code Cheat Sheet", url: "https://code.visualstudio.com/docs/getstarted/tips-and-tricks", icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: "GitHub Copilot in VS Code cheat sheet", url: "https://code.visualstudio.com/docs/copilot/copilot-vscode-features", icon: <Github className="h-4 w-4 mr-2" /> },
    // { name: "Project Repository", url: "https://github.com/yourusername/llm-notebook-project", icon: <Github className="h-4 w-4 mr-2" /> }
  ]

  // LLM models with copy functionality
  const llmModels = [
    { name: "OpenAI GPT-4o", id: "gpt-4o", description: "OpenAI's latest multimodal model" },
    { name: "Claude 3.7 Sonnet", id: "claude-3-7-sonnet-20250219", description: "Anthropic's advanced reasoning model" },
    { name: "Gemini 2.0 Pro", id: "gemini-2-0-pro", description: "Google's most capable model" },
  ];

  // README content with prompts
  const promptBlocks = [
    {
      number: 1,
      title: "Setting up the Streamlit Application",
      prompt: " Create a virtual environment and generate a basic Streamlit app that creates a web page with a text input box for users to write Python code. The app should display an output area for the results and a space for AI-based code suggestions.",
    },
    {
      number: 2,
      title: "Python Code Execution with Output Capture",
      prompt: "Write Python code within a Streamlit app that allows users to input and run Python code. Capture the output and display it below the input box. Handle any exceptions gracefully and display error messages",
    },
    {
      number: 3,
      title: "Markdown Rendering",
      prompt: "Add a markdown section in the Streamlit app that renders markdown text. Users should be able to input markdown text, and it should be displayed below the code execution area.",
    },
    {
      number: 4,
      title: "Matplotlib Support",
      prompt: "The LLM assistant lacks context about the input and output you're providing in your notebook cells. Can you provide contextual information to the assistant so it can better understand and respond to your questions?",
    },
    {
      number: 5,
      title: "OpenAI GPT-4o for Code Assistance",
      prompt: "Integrate Matplotlib support in the Streamlit app. Allow users to create and display plots from their Python code input. Display the generated plots below the input/output area",
    },
    {
        number:6,
        title:"Secure API Key Management",
        prompt:"Help me set up secure API key management in the Streamlit app. Use environment variables to store the OpenAI GPT-4 API key and ensure it is not exposed in the source code."
    },
    {
        number:7,
        title:"Secure API Key Management",
        prompt:"Help me set up secure API key management in the Streamlit app. Use environment variables to store the OpenAI GPT-4 API key and ensure it is not exposed in the source code."
    },
    {
        number:8,
        title:"Interactivity with the AI Assistant", // Missing comma was here
        prompt:"Enable interactive communication with the AI assistant. The user can ask the AI for help with their code, and the assistant should provide suggestions, explanations, or fixes to improve the code."
    },
    {
        number:9,
        title: "Combining All Features Together", // Missing comma was here
        prompt:"Combine the features above into a cohesive Streamlit app. Users should be able to input Python code, view the output, get AI-based suggestions, render markdown text, and display Matplotlib plots, all in one seamless interface"  
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">

        <MainNavbar
          title=""
          backUrl="/week1"
          backLabel="Back"
          rightContent={
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowApiKeys(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
              >
                <Key className="h-4 w-4" />
                API Keys
              </Button>
              
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
                onClick={() => {
                  // Mark exercise as complete
                  const storedCompletedExercises = localStorage.getItem('completedExercises') || '[]';
                  const completedExercises = JSON.parse(storedCompletedExercises);
                  
                  if (!completedExercises.includes('exercise4')) {
                    completedExercises.push('exercise4');
                    localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
                  }
                  
                  router.push('/week1');
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Exercise
              </Button>
            </div>
          }
        />

        <div className="text-center mb-6  mt-5">
                        <h2 className="text-xl md:text-2xl font-semibold text-white">Exercise 4 <span className="text-indigo-400">Copilot-Driven Development</span></h2>
                    </div>
      <TooltipProvider>
      </TooltipProvider>
{/*       
      <div className="flex justify-center py-4 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-xs ml-1 text-indigo-300 font-medium">
              Exercise 4: Building with Copilot
            </span>
          </div>
        </div>
      </div> */}

      <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
        {/* README-style markdown content */}
        <article className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-200">
            Building an LLM Assistant Notebook Using Copilot
          </h1>
          
          <div className="mb-8 text-gray-300">
            <p>In this exercise, we'll use GitHub Copilot to Create a Streamlit application that provides a Python code execution environment with AI assistance. The project should include the following features: Python code execution with output capture, markdown rendering, Matplotlib support, OpenAI GPT-4o for code assistance, and secure API key management. Users should be able to write and run Python code, interact with the AI assistant, and receive code-related suggestions or explanations</p>
          </div>

          {/* Resources Section */}
          <div className="mb-12 p-5 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Resources</h2>
            <div className="grid gap-3">
              {resources.map((resource, index) => (
                <Link 
                  href={resource.url}
                  key={index}
                  target="_blank"
                  className="flex items-center p-3 bg-gray-800/50 rounded hover:bg-gray-700/70 transition-colors"
                >
                  {resource.icon}
                  <span>{resource.name}</span>
                  <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
                </Link>
              ))}
            </div>
          </div>

          {/* LLM Models Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
              <span className="bg-indigo-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-base">1</span>
              Recommended LLM Models
            </h2>
            
            <div className="grid gap-3">
              {llmModels.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div>
                    <h3 className="font-medium text-gray-200">{model.name}</h3>
                    <p className="text-sm text-gray-400">{model.description}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopy(model.id, index + 100)} // Using index+100 to avoid conflict with prompt indices
                          className="p-2 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copiedIndex === index + 100 ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedIndex === index + 100 ? "Copied!" : "Copy model ID"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
            <span className="bg-indigo-600 rounded-full w-8 h-8 inline-flex items-center justify-center mr-3 text-base">2</span>
            GitHub Copilot Prompts
          </h2>
          
          <p className="mb-6">
            Use these prompts with GitHub Copilot to build your LLM-powered notebook. Each prompt addresses a specific part of the implementation:
          </p>

          {promptBlocks.map((block, index) => (
            <div key={index} className="mb-10">
              <h3 className="text-xl font-semibold text-gray-300 mb-3 flex items-center">
                <span className="bg-indigo-600/70 w-7 h-7 rounded-full text-sm flex items-center justify-center mr-2">
                  {block.number}
                </span>
                {block.title}
              </h3>
              
              <div className="relative bg-black/40 rounded-md overflow-hidden border border-gray-800/80">
                <div className="flex items-center justify-between bg-gray-800/60 px-4 py-2 text-sm font-medium border-b border-gray-700/50">
                  <span>Prompt</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopy(block.prompt, index)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                        >
                          {copiedIndex === index ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedIndex === index ? "Copied!" : "Copy prompt"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="p-4 bg-gray-900/30 text-gray-300 text-sm">
                  {block.prompt}
                </div>
              </div>
            </div>
          ))}

          <h2 className="text-2xl font-bold text-gray-200 mt-12 mb-6">Implementation Tips</h2>
          
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
            <li>Start by implementing the basic API integration with OpenAI</li>
            <li>Build the secure API key management system next</li>
            <li>Create a robust code execution environment that properly captures outputs</li>
            <li>Add context management to improve the LLM's understanding of notebook state</li>
            <li>Finally, enhance the UI to provide a better user experience</li>
          </ul>
          
          <div className="mt-10 p-4 bg-indigo-900/30 border border-indigo-800/50 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-indigo-300">Next Steps</h3>
            <p className="text-gray-300">
              After completing this exercise, consider exploring more advanced techniques like streaming responses,
              improved error handling, or supporting additional LLM providers.
            </p>
          </div>
        </article>
      </main>

      {/* API Keys Dialog */}
      <Dialog open={showApiKeys} onOpenChange={setShowApiKeys}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">API Keys Configuration</DialogTitle>
            <DialogDescription>
              These keys are required for connecting to various LLM providers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {apiKeys.map((key, index) => (
              <div key={key.name} className="flex items-center justify-between">
                <div className="font-mono text-sm text-gray-300">{key.name}</div>
                <div className="flex items-center">
                  <div className="font-mono text-sm bg-gray-800 px-3 py-1 rounded-l border border-gray-700">
                    {maskApiKey(key.value)}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => handleCopy(key.value, index + 1000)} 
                          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-r border-t border-r border-b border-gray-700"
                        >
                          {copiedIndex === index + 1000 ? 
                            <Check className="h-4 w-4 text-green-400" /> : 
                            <Copy className="h-4 w-4 text-gray-300" />
                          }
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {copiedIndex === index + 1000 ? "Copied!" : "Copy full API key"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setShowApiKeys(false)}
              className="bg-indigo-600 hover:bg-indigo-700 w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
        <div class="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}