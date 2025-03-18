"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

interface PromptTechniquePanelProps {
  techniqueId: string
  techniqueTitle: string
  systemMessage: string
  prompt: string
  response: string | null
  isGenerating: boolean
}

const PromptTechniquePanel: React.FC<PromptTechniquePanelProps> = ({ techniqueId, techniqueTitle, systemMessage, prompt, response, isGenerating }) => {
  return (
    <div className="h-full flex flex-col border-r border-[#1A1A1A] overflow-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between p-2 border-b border-[#1A1A1A]">
        <div className="flex items-center space-x-2">
          {/* <div className={`w-6 h-6 flex items-center justify-center bg-[#1A1A1A] rounded text-sm font-medium`}>
            {techniqueId}
          </div> */}
          <div className="text-white font-semibold">{techniqueTitle}</div>
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 p-4 overflow-auto bg-[#0D0D0D]">
        {/* System Message */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">System Message</div>
          <div className="p-3 bg-[#1A1A1A] rounded-lg text-sm text-gray-300">{systemMessage}</div>
        </div>

        {/* Prompt */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Prompt</div>
          <div className="p-3 bg-[#1A1A1A] rounded-lg text-sm text-gray-300">{prompt}</div>
        </div>

        {/* Response */}
        <div className="space-y-1">
          <div className="text-sm text-gray-400">Response</div>
          {isGenerating ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : response ? (
            <div className="text-sm text-white whitespace-pre-wrap">{response}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default PromptTechniquePanel