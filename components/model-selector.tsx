"use client"

import * as React from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ModelSelectorProps {
  selectedModels: string[]
  onModelChange: (models: string[]) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModels = [], onModelChange }) => {
  // Display label based on selection count
  const getButtonLabel = () => {
    if (selectedModels.length === 0) return "Select LLM models";
    if (selectedModels.length === 1) return selectedModels[0];
    return `${selectedModels.length} models selected`;
  }

  // Old model selection logic merged with new UI structure
  const handleModelChange = (model: string, checked: boolean) => {
    if (checked) {
      if (selectedModels.length < 3) onModelChange([...selectedModels, model]);
    } else {
      onModelChange(selectedModels.filter(m => m !== model));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48 h-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-indigo-900/30 text-sm text-white justify-between hover:border-indigo-500/50 transition-all duration-300">
          {getButtonLabel()}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#1A1A1A] border border-[#333333] text-white">
        <div className="p-2 text-sm text-gray-400 font-semibold">OpenAI</div>
        <DropdownMenuCheckboxItem
          checked={selectedModels.includes("gpt-4o")}
          onCheckedChange={(checked) => handleModelChange("gpt-4o", checked)}
        >
          GPT-4o
        </DropdownMenuCheckboxItem>

        <div className="p-2 text-sm text-gray-400 font-semibold">Anthropic</div>
        <DropdownMenuCheckboxItem
          checked={selectedModels.includes("claude-3-7-sonnet-20250219")}
          onCheckedChange={(checked) => handleModelChange("claude-3-7-sonnet-20250219", checked)}
        >
          Claude 3-7-sonnet
        </DropdownMenuCheckboxItem>

        <div className="p-2 text-sm text-gray-400 font-semibold">Google</div>
        <DropdownMenuCheckboxItem
          checked={selectedModels.includes("gemini-2.0-flash")}
          onCheckedChange={(checked) => handleModelChange("gemini-2.0-flash", checked)}
        >
          Gemini 2.0-flash
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelector
