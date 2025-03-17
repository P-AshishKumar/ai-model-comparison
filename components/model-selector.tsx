"use client"
 
import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
 
interface ModelSelectorProps {
  selectedModels: string[]
  onModelChange: (models: string[]) => void
}
 
const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModels, onModelChange }) => {
  // Instead of using the Select component with multiple=true, use DropdownMenu with checkbox items
  // This is because the shadcn Select component doesn't properly support multiple selection
  
  // Display label based on selection count
  const getButtonLabel = () => {
    if (selectedModels.length === 0) return "Select LLM models";
    if (selectedModels.length === 1) return selectedModels[0];
    return `${selectedModels.length} models selected`;
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
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "gpt-4o"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "gpt-4o"));
            }
          }}
        >
          GPT-4o
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem 
          checked={selectedModels.includes("gpt-4")}
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "gpt-4"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "gpt-4"));
            }
          }}
        >
          GPT-4
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem 
          checked={selectedModels.includes("gpt-3.5-turbo")}
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "gpt-3.5-turbo"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "gpt-3.5-turbo"));
            }
          }}
        >
          GPT-3.5 Turbo
        </DropdownMenuCheckboxItem>
        
        <div className="p-2 text-sm text-gray-400 font-semibold">Anthropic</div>
        <DropdownMenuCheckboxItem 
          checked={selectedModels.includes("claude-3-5")}
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "claude-3-5"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "claude-3-5"));
            }
          }}
        >
          Claude 3.5
        </DropdownMenuCheckboxItem>
        
        <div className="p-2 text-sm text-gray-400 font-semibold">Gemini</div>
        <DropdownMenuCheckboxItem 
          checked={selectedModels.includes("gemini-1")}
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "gemini-1"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "gemini-1"));
            }
          }}
        >
          Gemini 1
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem 
          checked={selectedModels.includes("gemini-2")}
          onCheckedChange={(checked) => {
            if (checked) {
              if (selectedModels.length < 3) onModelChange([...selectedModels, "gemini-2"]);
            } else {
              onModelChange(selectedModels.filter(m => m !== "gemini-2"));
            }
          }}
        >
          Gemini 2
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
 
export default ModelSelector