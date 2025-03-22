"use client"

import * as React from "react"
import { Loader2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface PromptTechniquePanelProps {
  techniqueId: string
  techniqueTitle: string
  systemMessage: string
  prompt: string
  response: string | null
  isGenerating: boolean
}

const PromptTechniquePanel: React.FC<PromptTechniquePanelProps> = ({ 
  techniqueId, 
  techniqueTitle, 
  systemMessage, 
  prompt, 
  response, 
  isGenerating 
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full flex flex-col border-r border-[#1A1A1A] overflow-hidden rounded-lg shadow-lg">
      {/* Panel header - Now more prominent */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-[#1A1A1A] to-[#252525] border-b border-[#333]">
        <div className="flex items-center space-x-2">
          <div className="text-white font-bold text-sm sm:text-base">{techniqueTitle}</div>
        </div>
      </div>

      {/* Panel content - Now with responsive grid layout */}
      <div className="flex-1 p-3 sm:p-5 overflow-auto bg-[#0D0D0D] space-y-4 sm:space-y-6">
        {/* System Message - With copy button */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">System Message</div>
            <button 
              onClick={() => handleCopy(systemMessage, 'system')} 
              className="text-gray-500 hover:text-gray-300 p-1 rounded-md"
            >
              {copied === 'system' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="p-3 sm:p-4 bg-[#1A1A1A] rounded-lg text-xs sm:text-sm text-gray-300 max-h-[120px] overflow-auto">
            {systemMessage}
          </div>
        </div>

        {/* Prompt - With copy button */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">Prompt</div>
            <button 
              onClick={() => handleCopy(prompt, 'prompt')} 
              className="text-gray-500 hover:text-gray-300 p-1 rounded-md"
            >
              {copied === 'prompt' ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <div className="p-3 sm:p-4 bg-[#1A1A1A] rounded-lg text-xs sm:text-sm text-gray-300 max-h-[120px] overflow-auto">
            {prompt}
          </div>
        </div>

        {/* Response - Larger area with copy button */}
        <div className="relative flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs sm:text-sm text-gray-400 font-medium">Response</div>
            {response && (
              <button 
                onClick={() => handleCopy(response, 'response')} 
                className="text-gray-500 hover:text-gray-300 p-1 rounded-md"
              >
                {copied === 'response' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
          </div>
          
          {isGenerating ? (
            <div className="flex items-center justify-center p-8 sm:p-12 bg-[#1A1A1A] rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : response ? (
            <div className="p-3 sm:p-4 bg-[#1A1A1A] rounded-lg text-xs sm:text-sm text-white whitespace-pre-wrap max-h-[200px] sm:max-h-[300px] overflow-auto">
              {response}
            </div>
          ) : (
            <div className="p-3 sm:p-4 bg-[#1A1A1A] rounded-lg text-xs sm:text-sm text-gray-500 flex items-center justify-center h-[100px]">
              No response generated yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromptTechniquePanel