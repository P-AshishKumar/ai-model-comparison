"use client"

import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainNavbar from "@/components/MainNavbar"
import Screen1 from "../Screen1"
import { Key, Copy, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useApiStore } from "@/hooks/useApiStore"

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

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("")
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <TooltipProvider>
        <MainNavbar
          title={""}
          rightContent={
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowApiKeys(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
              >
                <Key className="h-4 w-4" />
                API Keys
              </Button>
              {/* <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Logout
              </button> */}
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

        <Screen1 />

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
      </TooltipProvider>
    </div>
  )
}

