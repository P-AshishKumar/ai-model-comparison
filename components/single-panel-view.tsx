"use client"
 
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowUp, Mic, RotateCcw, Sliders, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import ModelSelector from "@/components/model-selector"
import { questions } from "@/components/questions"
import { Tooltip as ReactTooltip } from "react-tooltip"
import "/styles/SinglePanelView.css"
 
interface SinglePanelViewProps {
  response: string | null
  isGenerating: boolean
  prompt: string
  onSubmit: (input: string) => void
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  onQuestionSelect: (question: { title: string, question: string, options: string[] }) => void
}
 
export default function SinglePanelView({ response, isGenerating, prompt, onSubmit, messages, onQuestionSelect }: SinglePanelViewProps) {
  const [input, setInput] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [temperature, setTemperature] = useState(1.0)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
 
  const messagesEndRef = useRef<HTMLDivElement>(null)
 
  const handleSubmit = async () => {
    if (input.trim() && !isGenerating) {
      const userMessage = input.trim()
      onSubmit(userMessage)
      setInput("")
 
      try {
        setIsGenerating(true)
 
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: userMessage,
            models: selectedModels,
            temperature,
            maxTokens,
          }),
        })
 
        if (!response.ok) {
          throw new Error("Failed to generate response")
        }
 
        const data = await response.json()
        onSubmit(data.text)
      } catch (error) {
        console.error("Error generating response:", error)
      } finally {
        setIsGenerating(false)
      }
    }
  }
 
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }
 
  const handleClear = () => {
    setInput("")
  }
 
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isGenerating])
 
  const handleModelRemove = (model: string) => {
    setSelectedModels(selectedModels.filter((m) => m !== model))
  }
 
  return (
    <div className="single-panel-view flex h-full">
      {/* Left side - Questions and configuration */}
      <div className="left-panel flex flex-col w-1/3 border-r border-[#1A1A1A] p-4">
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
 
        {/* Display selected models */}
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
            <div className="text-sm text-gray-400 mb-2">Select a question:</div>
            <ul className="space-y-4">
              {questions.map((question) => (
                <div 
                  key={question.id} 
                  className="p-3 border border-gray-700 rounded-lg mb-2 cursor-pointer bg-gradient-to-r from-gray-900 to-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                  onClick={() => onQuestionSelect(question)}
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
            </ul>
          </div>
        </div>
      </div>
 
      {/* Right side - Chat interface */}
      <div className="right-panel flex-1 flex flex-col p-4">
        <div className="messages flex-1 overflow-auto">
          {messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <div className="role">
                    {message.role === 'user' ? 'User' : 'Assistant'}
                  </div>
                  <div className="content">
                    <div className={`mb-4 ${message.role === 'user' ? 'ml-auto' : ''}`}>
                      <div
                        className={`p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white ml-12'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 mr-12'
                        }`}
                      >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="message">
                  <div className="role">Assistant</div>
                  <div className="flex items-center justify-center p-4">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                      <div className="absolute inset-[3px] border-t-2 border-indigo-400 border-solid rounded-full animate-spin-slow"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Your conversation will appear here
            </div>
          )}
        </div>
 
        {/* Chat input integrated in the right panel */}
        <div className="input-container mt-4">
          <div className="input-wrapper relative flex items-end bg-[#1A1A1A] border border-[#333333] rounded transition-colors focus-within:border-[#666666]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter user message..."
              className="textarea flex-1 max-h-40 p-3 bg-transparent border-0 resize-none outline-none text-white text-sm"
            />
            <div className="buttons absolute bottom-2 right-2 flex gap-2">
              <Button size="icon" variant="ghost" className="button" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="button">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="button">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={!input.trim() || isGenerating}
                className="submit-button bg-[#10A37F] hover:bg-[#0D8A6C] disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
 
      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="absolute z-50 bg-[#1A1A1A] p-6 rounded-lg w-96"
          style={{
            top: filterButtonRef.current?.getBoundingClientRect().bottom + window.scrollY + 10,
            left: filterButtonRef.current?.getBoundingClientRect().left + window.scrollX,
          }}
        >
          <h2 className="text-white text-lg mb-4">Model Settings</h2>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-2 block" data-tip="Controls the randomness of the output. Lower values make the output more deterministic.">Temperature</label>
            <ReactTooltip place="top" type="dark" effect="solid" />
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
            <ReactTooltip place="top" type="dark" effect="solid" />
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