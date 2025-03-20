"use client"

import * as React from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface ModelSelectorProps {
  selectedModels: string[]
  onModelChange: (models: string[]) => void
  onOpenChange?: (open: boolean) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModels = [], 
  onModelChange,
  onOpenChange 
}) => {
  // Display label based on selection count
  const getButtonLabel = () => {
    if (selectedModels.length === 0) return "Select LLM models";
    if (selectedModels.length === 1) return selectedModels[0];
    return `${selectedModels.length} models selected`;
  }

  // Model selection logic
  const handleModelChange = (model: string, checked: boolean) => {
    if (checked) {
      if (selectedModels.length < 3) onModelChange([...selectedModels, model]);
    } else {
      onModelChange(selectedModels.filter(m => m !== model));
    }
  }

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-56 h-10 bg-gradient-to-r from-[#1A1A1A] to-[#111] border border-indigo-900/30 text-sm text-white justify-between hover:border-indigo-500/50 transition-all duration-300">
          {getButtonLabel()}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        sideOffset={4}
        className="bg-[#1A1A1A] border border-[#333333] text-white z-[60] w-56"
      >
        {/* Vertical layout structure */}
        <div className="p-2 flex flex-col gap-4">
          <div>
            <div className="text-sm text-gray-400 font-semibold mb-2">OpenAI</div>
            <DropdownMenuCheckboxItem
              checked={selectedModels.includes("gpt-4o")}
              onCheckedChange={(checked) => handleModelChange("gpt-4o", checked)}
              className="mb-1"
            >
              GPT-4o
            </DropdownMenuCheckboxItem>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 font-semibold mb-2">Anthropic</div>
            <DropdownMenuCheckboxItem
              checked={selectedModels.includes("claude-3-7-sonnet-20250219")}
              onCheckedChange={(checked) => handleModelChange("claude-3-7-sonnet-20250219", checked)}
              className="mb-1"
            >
              Claude 3.7 Sonnet
            </DropdownMenuCheckboxItem>
          </div>
          
          <div>
            <div className="text-sm text-gray-400 font-semibold mb-2">Google</div>
            <DropdownMenuCheckboxItem
              checked={selectedModels.includes("gemini-2.0-flash")}
              onCheckedChange={(checked) => handleModelChange("gemini-2.0-flash", checked)}
              className="mb-1"
            >
              Gemini 2.0-flash
            </DropdownMenuCheckboxItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelector
