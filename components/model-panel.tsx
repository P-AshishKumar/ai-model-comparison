"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Save, Copy, X, Loader2 } from "lucide-react"

interface ModelPanelProps {
  response: string | null
  isGenerating: boolean
  prompt: string
  showResponseArea: boolean
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  className?: string
  selectedModel: string
}

const ModelPanel: React.FC<ModelPanelProps> = ({ response, isGenerating, prompt, showResponseArea, messages, className, selectedModel }) => {

  return (
    <div className={`h-full flex flex-col border-r border-gray-800/50 bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950 ${className}`}>
      {/* Panel header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="flex-1 flex justify-center items-center space-x-2">
          <div className="text-sm text-white">{selectedModel}</div>
        </div>
        <div className="flex items-center space-x-1">
          {/* <Button variant="ghost" size="icon" className="h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 p-4 overflow-auto bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950">
        {/* System Message */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">System message</div>
          <div className="p-3 bg-[#1A1A1A] rounded-lg text-sm text-gray-300">You are a helpful assistant...</div>
        </div>

        {/* Messages */}
        {prompt && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">User</div>
              <div className="text-sm text-white">{prompt}</div>
            </div>

            {showResponseArea && (
              <div className="space-y-1">
                <div className="text-sm text-gray-400">Assistant</div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : response ? (
                  <div className="text-sm text-white whitespace-pre-wrap">{response}</div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelPanel
