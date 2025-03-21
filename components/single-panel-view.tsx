"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sliders, X, File } from "lucide-react" // Add File icon import
import ModelSelector from "@/components/model-selector"
import { questions } from "@/components/questions"
import { Tooltip as ReactTooltip } from "react-tooltip"
import "/styles/SinglePanelView.css"

interface SinglePanelViewProps {
  onQuestionSelect: (question: { title: string, question: string, options: string[] }) => void
  selectedQuestion: { title: string, question: string, options: string[] } | null
  setSelectedModels: (models: string[]) => void
  selectedModels: string[]
}

export default function SinglePanelView({ onQuestionSelect, selectedQuestion, setSelectedModels, selectedModels }: SinglePanelViewProps) {
  const [temperature, setTemperature] = useState(1.0)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  // Add state for document preview
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)

  // Remove a model from the selected models
  const handleModelRemove = (model: string) => {
    setSelectedModels(selectedModels.filter((m) => m !== model))
  }

  // Handle question selection
  const handleQuestionSelect = (question: { title: string, question: string, options: string[] }) => {
    onQuestionSelect(question)
  }

  // Toggle document preview modal
  const toggleDocumentPreview = () => {
    setShowDocumentPreview(!showDocumentPreview)
  }

  // Get the document filename based on selected question
  const getDocumentFilename = () => {
    // Default to first document
    return "Mobile-Device-Policy.pdf"
  }

  // Document Preview Modal Component
  const DocumentPreviewModal = () => {
    if (!showDocumentPreview) return null

    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-xl font-medium text-white flex items-center">
              <File className="mr-2 h-5 w-5" /> {getDocumentFilename()}
            </h2>
            <Button onClick={toggleDocumentPreview} variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`/${getDocumentFilename()}#view=FitH`}
              className="w-full h-full"
              title="Document Preview"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="single-panel-view flex h-full">
      {/* Left side - Questions and configuration */}
      <div className="w-full flex flex-col p-4">
        {/* Header with exercise title and view document button */}
        <div className="flex justify-center items-center mb-6 relative">
          <h2 className="text-xl md:text-2xl font-semibold text-white text-center">
            Exercise 1 <span className="text-indigo-400">Compare LLM Models</span>
          </h2>

          {/* View Document button positioned absolutely to the right of the title */}
          
        </div>

        <div className="header mb-4 flex items-center space-x-2">
          <ModelSelector selectedModels={selectedModels} onModelChange={setSelectedModels} />
          <Button
            ref={filterButtonRef}
            size="icon"
            variant="ghost"
            className="button"
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <Sliders className="h-5 w-5" />
          </Button>
        </div>

        <div className="selected-models mb-4 flex flex-wrap gap-2">
          {selectedModels.map((model) => (
            <div key={model} className="flex items-center bg-gray-700 text-white px-2 py-1 rounded">
              {model}
              <button onClick={() => handleModelRemove(model)} className="ml-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="content flex-1 overflow-auto hide-scrollbar">
          {/* Questions */}
          <div className="questions">
            <div className="text-sm text-gray-400 mb-2 text-center">Select a Scenario</div>
            <div className="flex flex-col space-y-4 max-w-3xl mx-auto px-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${selectedQuestion?.id === question.id
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-900/80 to-blue-900/80 shadow-[0_0_20px_rgba(99,102,241,0.5)] transform scale-[1.02]'
                    : 'border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    }`}
                  onClick={() => handleQuestionSelect(question)}
                >
                  {/* Add a visual indicator for selected question */}
                  {selectedQuestion?.id === question.id && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-indigo-600/60 text-indigo-200 text-xs px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Selected
                      </span>
                    </div>
                  )}

                  <div className={`text-xl font-semibold mb-3 ${selectedQuestion?.id === question.id ? 'text-white' : 'text-white'}`}>
                    {question.title}
                  </div>
                  <div className={`mb-4 ${selectedQuestion?.id === question.id ? 'text-indigo-100' : 'text-gray-300'}`}>
                    {question.question}
                  </div>
                  <ul className="space-y-2">
                    {question.options.map((option, index) => (
                      <li key={index}>
                        <div className={`text-left w-full p-2 rounded text-white ${selectedQuestion?.id === question.id
                          ? 'bg-indigo-800/60 border border-indigo-500/40'
                          : 'bg-[#2A2A2A]'
                          }`}>
                          {option}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="absolute z-50 bg-[#1A1A1A] p-6 rounded-lg w-96"
          style={{
            top: filterButtonRef.current ? filterButtonRef.current.getBoundingClientRect().bottom + window.scrollY + 10 : 0,
            left: filterButtonRef.current ? filterButtonRef.current.getBoundingClientRect().left + window.scrollX : 0,
          }}
        >
          <h2 className="text-white text-lg mb-4">Model Settings</h2>
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

      {/* Add the document preview modal */}
      <DocumentPreviewModal />
    </div>
  )
}