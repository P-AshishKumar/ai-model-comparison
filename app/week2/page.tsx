"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ExternalLink, CheckCircle, Key, Copy, Check } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useApiStore } from "@/hooks/useApiStore"

// Define the Google Colab links for demos
const DEMO_LINKS = {
  demo1: "https://colab.research.google.com/drive/1VWjjNL4rw5ZsIWeAhHKS12tsywcg-XOA?usp=sharing",
  demo2: "https://colab.research.google.com/drive/1UdI9jFeVGUnVqAcTEhoiP38wqV8gWK4N?usp=sharing",
  demo3: "https://colab.research.google.com/drive/138H-uQyXwXcxBxHv0wRgLTNEJwBcf6V8?usp=sharing"
}

// Helper function to mask API keys
const maskApiKey = (key: string): string => {
  if (!key || key === "sk-..." || key === "AIza..." || key === "sk-ant-...") {
    return "Not configured";
  }
  // Only show first 4 and last 4 characters
  return key.length <= 8
    ? "********"
    : `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export default function Week2Page() {
  const router = useRouter()
  const [completedItems, setCompletedItems] = useState<string[]>([])
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

  useEffect(() => {
    // Load completed items from localStorage
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('week2CompletedItems')
      if (storedItems) {
        setCompletedItems(JSON.parse(storedItems))
      }
    }
  }, [])

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

  // Function to open demo links in a new tab
  const handleDemoClick = (demoId: string) => {
    const link = DEMO_LINKS[demoId as keyof typeof DEMO_LINKS]
    if (link) {
      window.open(link, '_blank')
      
      // Mark as completed
      if (!completedItems.includes(demoId)) {
        const updatedItems = [...completedItems, demoId]
        setCompletedItems(updatedItems)
        localStorage.setItem('week2CompletedItems', JSON.stringify(updatedItems))
      }
    }
  }

  // Function to navigate to lab exercise page
  const handleLabExerciseClick = () => {
    router.push('/week2/lab-exercise')
  }

  // Handle logout functionality
  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <TooltipProvider>
        <MainNavbar 
          backUrl="/week1"
          backLabel="Back"
          onBack={() => router.push('/dashboard')}
          rightContent={
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowApiKeys(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
                size="sm"
              >
                <Key className="h-4 w-4" />
                API Keys
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                size="sm"
              >
                Logout
              </Button>
            </div>
          }
        />

        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Week 2 <span className="text-indigo-400">Resources</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore demos and complete the lab exercise to learn NLP concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Demo 1 Card */}
            <Card className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-white">
                    Demo 1
                  </CardTitle>
                  {completedItems.includes("demo1") && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Visited
                    </span>
                  )}
                </div>
                <CardDescription className="text-indigo-200">
                Getting Started with NLP
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>Explore Tokenization, Stop Words, and POS Tagging with interactive examples in Google Colab.</p>
                
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleDemoClick("demo1")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Open in Colab
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Rest of your cards... */}
            {/* Demo 2 Card */}
            <Card className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-white">
                    Demo 2
                  </CardTitle>
                  {completedItems.includes("demo2") && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Visited
                    </span>
                  )}
                </div>
                <CardDescription className="text-indigo-200">
                Named Entity Recognition (NER) Showdown
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>Comparing Traditional NLP and LLMs Across Real-World Domains</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleDemoClick("demo2")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Open in Colab
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Demo 3 Card */}
            <Card className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-white">
                    Demo 3
                  </CardTitle>
                  {completedItems.includes("demo3") && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Visited
                    </span>
                  )}
                </div>
                <CardDescription className="text-indigo-200">
                Document Embeddings
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>Exploring Document Embeddings in Real-World Contexts</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleDemoClick("demo3")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Open in Colab
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Lab Exercise Card */}
            <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(147,51,234,0.4)] border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl text-white">
                    Lab Exercise
                  </CardTitle>
                  {completedItems.includes("lab") && (
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  )}
                </div>
                <CardDescription className="text-purple-200">
                  Hands-on Project
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-200">
                <p>Apply what you've learned by completing a comprehensive lab exercise with detailed steps.</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleLabExerciseClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Start Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
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

        <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
          </div>
        </footer>
      </TooltipProvider>
    </div>
  )
}