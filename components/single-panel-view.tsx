"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sliders, X, ArrowLeft, ArrowLeftRight, ArrowRight } from "lucide-react"
import ModelSelector from "@/components/model-selector"
import { questions } from "@/components/questions"
import { Tooltip as ReactTooltip } from "react-tooltip"
import { useRouter } from 'next/navigation'
import "/styles/SinglePanelView.css"

interface SinglePanelViewProps {
  onQuestionSelect: (question: { title: string, question: string, options: string[] }) => void
  selectedQuestion: { title: string, question: string, options: string[] } | null
  setSelectedModels: (models: string[]) => void
  selectedModels: string[]
  onCompareClick: () => void
}

export default function SinglePanelView({ 
  onQuestionSelect, 
  selectedQuestion, 
  setSelectedModels, 
  selectedModels,
  onCompareClick
}: SinglePanelViewProps) {
  const router = useRouter()
  const [temperature, setTemperature] = useState(1.0)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close the filter modal when the dropdown opens
  const handleDropdownStateChange = (open: boolean) => {
    setIsDropdownOpen(open);
    if (open && showFilterModal) {
      setShowFilterModal(false);
    }
  };

  // Handle button click to toggle filter modal
  const handleFilterButtonClick = () => {
    if (isDropdownOpen) {
      // If dropdown is open, close it first
      setIsDropdownOpen(false);
      // Schedule filter modal to open after dropdown closes
      setTimeout(() => setShowFilterModal(!showFilterModal), 100);
    } else {
      setShowFilterModal(!showFilterModal);
    }
  };

  // Remove a model from the selected models
  const handleModelRemove = (model: string) => {
    setSelectedModels(selectedModels.filter((m) => m !== model))
  }

  // Handle question selection
  const handleQuestionSelect = (question: { title: string, question: string, options: string[] }) => {
    onQuestionSelect(question)
  }

  // Update handleCompareClick to call the parent's onCompareClick
  const handleCompareClick = () => {
    if (selectedModels.length >= 2 && selectedQuestion) {
      onCompareClick(); // Call the parent function to handle the navigation
    } else {
      console.log("Please select at least two models and a question to compare.");
    }
  }

  // Add a new function to handle the "Next" button click in the top right
  const handleNextClick = () => {
    router.push('/playground2'); // Navigate to exercise 2
  }

  return (
    <div className="single-panel-view flex flex-col h-full overflow-hidden">
      {/* Header - fixed height */}
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col">
          <div className="flex items-center px-4 justify-between">
            {/* Left side - Back button */}
            <div className="w-24">
              <Button variant="ghost" size="sm" onClick={() => router.push('/document-upload')} className="text-gray-400 hover:text-white">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </div>
            
            {/* Center - Title */}
            <div className="flex-1 flex items-center justify-center text-white font-semibold text-lg">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-gray-400">AI-CCORE</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="text-white">Exercise 1</span>
            </div>
            
            {/* Right side - Next button */}
            <div className="w-24 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNextClick} 
                className="text-gray-400 hover:text-white"
              >
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2 justify-center mt-2">
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-900/50 text-indigo-300">
                1
              </div>
              <span>Upload Document</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-500 text-white">
                2
              </div>
              <span>Select Scenario</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-900/50 text-indigo-300">
                3
              </div>
              <span>Compare Models</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - Use flex-1 to expand and set overflow handling */}
      <div className="w-full flex flex-col flex-1 relative overflow-hidden">
        {/* Model selection section - fixed height */}
        <div className="p-4 pb-0">
          {/* Model selection and filter - moved to left end */}
          <div className="absolute top-4 left-8 flex items-center space-x-2 z-10">
            <div ref={dropdownRef}>
              <ModelSelector
                selectedModels={selectedModels}
                onModelChange={setSelectedModels}
                onOpenChange={handleDropdownStateChange}
              />
            </div>
            <Button
              ref={filterButtonRef}
              size="icon"
              variant="ghost"
              className="button"
              onClick={handleFilterButtonClick}
            >
              <Sliders className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Selected models section - horizontal layout */}
          <div className="selected-models mt-16 mb-4">
            <div className="flex flex-row flex-wrap gap-2 items-center">
              {selectedModels.map((model) => (
                <div key={model} className="flex items-center bg-gray-700 text-white px-2 py-1 rounded">
                  <span className="truncate">{model}</span>
                  <button onClick={() => handleModelRemove(model)} className="ml-2 flex-shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Questions section - scrollable with flex-1 to take remaining height */}
        <div className="flex-1 overflow-y-auto p-4 pt-0">
          <div className="questions">
            <div className="text-lg font-bold text-gray-200 mb-4 text-center">Select a Scenario</div>
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto px-4 pb-8">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-3 border border-gray-700 rounded-lg cursor-pointer bg-gradient-to-r from-gray-900 to-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300
                  ${selectedQuestion?.id === question.id
                    ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] bg-gradient-to-r from-blue-700 to-blue-800'
                    : 'hover:bg-gray-700'}`}
                  onClick={() => handleQuestionSelect(question)}
                >
                  <div className="text-white font-semibold mb-2">{question.title}</div>
                  <div className="text-gray-300 mb-2">{question.question}</div>
                  <ul className="space-y-1">
                    {question.options.map((option, index) => (
                      <li key={index}>
                        <div className="text-left w-full p-2 bg-[#2A2A2A] rounded text-white">
                          {option}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Add Compare Models button at the bottom of the questions */}
            {selectedQuestion && selectedModels.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={handleCompareClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md flex items-center gap-2"
                >
                  Compare Models
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            
           
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="absolute z-50 bg-[#1A1A1A] p-6 rounded-lg w-96"
          style={{
            top: filterButtonRef.current ? filterButtonRef.current.getBoundingClientRect().bottom + window.scrollY + 10 : 0,
            left: 8, // Changed from right: 4 to left: 8
            boxShadow: "0 10px 25px rgba(79,70,229,0.6), 0 0 5px rgba(79,70,229,0.8), 0 0 15px rgba(79,70,229,0.4)"
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg">Model Settings</h2>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              onClick={() => setShowFilterModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block" data-tip="Controls the randomness of the output. Lower values make the output more deterministic.">Temperature</label>
            <ReactTooltip place="top" className="dark" />
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-gray-400 text-sm mt-1">{temperature}</div>
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block" data-tip="The maximum number of tokens to generate. Higher values allow for longer responses.">Max Tokens</label>
            <ReactTooltip place="top" className="dark" />
            <input
              type="range"
              min="1"
              max="4096"
              step="1"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-gray-400 text-sm mt-1">{maxTokens}</div>
          </div>
        </div>
      )}
    </div>
  )
}