"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sliders, X } from "lucide-react"
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

  // Remove a model from the selected models
  const handleModelRemove = (model: string) => {
    setSelectedModels(selectedModels.filter((m) => m !== model))
  }

  // Handle question selection
  const handleQuestionSelect = (question: { title: string, question: string, options: string[] }) => {
    onQuestionSelect(question)
  }

  return (
    <div className="single-panel-view flex h-full">
      {/* Left side - Questions and configuration */}
      <div className="w-full flex flex-col p-4">
        {/* Add exercise title in header */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">Exercise 1: <span className="text-indigo-400">Compare LLM Models</span></h2>
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

        <div className="content flex-1 overflow-auto">
          {/* Questions */}
          <div className="questions">
            <div className="text-sm text-gray-400 mb-2 text-center">Select a Scenario:</div>            <div className="flex flex-col space-y-4 max-w-3xl mx-auto px-4">
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
    </div>
  )
}