"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  console.log("ModelSelector - selectedModel:", selectedModel); // ✅ Debugging
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-48 h-10 bg-[#1A1A1A] border border-[#333333] text-sm text-white">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="bg-[#1A1A1A] border border-[#333333] text-white">
        <SelectGroup>
          <SelectLabel className="text-gray-400">OpenAI</SelectLabel>
          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
          {/* <SelectItem value="gpt-4">GPT-4</SelectItem>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem> */}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-gray-400">Anthropic</SelectLabel>
          <SelectItem value="claude-3-7-sonnet-20250219">Claude-3-7-sonnet</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel className="text-gray-400">Google</SelectLabel>
          <SelectItem value="gemini-2.0-flash">Gemini-2.0-flash</SelectItem>
          {/* <SelectItem value="gemini-2">Gemini 2</SelectItem> */}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ModelSelector

