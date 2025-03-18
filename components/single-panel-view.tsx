"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ArrowUp, Mic, RotateCcw, Sliders, X, Trash2 } from "lucide-react"
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
  onQuestionSelect: (question: { title: string, question: string, options: string[] }) => void
}

export default function SinglePanelView({ response, isGenerating, prompt, onSubmit, onQuestionSelect }: SinglePanelViewProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [selectedModel, setSelectedModel] = useState("")
  const [temperature, setTemperature] = useState(1.0)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isGeneratingState, setIsGenerating] = useState(false)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    if (input.trim() && !isGeneratingState) {
      const userMessage = input.trim()
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])
      setInput("")
      setIsGenerating(true)

      try {
        // Determine the correct API endpoint based on the selected model
        const endpoint = selectedModel.startsWith("gpt-") ? "openai" :
                         selectedModel.startsWith("claude-") ? "anthropic" :
                         selectedModel.startsWith("gemini-") ? "google" : null

        if (!endpoint) {
          throw new Error("Unsupported model selected")
        }

        // Create the conversation history as a single string
        const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${userMessage}`

        const response = await fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: conversationHistory,
            model: selectedModel,
            temperature,
            maxTokens,
          }),
        })

        if (!response.ok) throw new Error("Failed to generate response")

        const data = await response.json()

        setMessages((prev) => [...prev, { role: "assistant", content: data.text }])
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

  const handleClearChat = () => {
    setMessages([])
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)

    return () => clearTimeout(timeout)
  }, [messages, isGeneratingState])

  return (
    <div className="single-panel-view flex h-full">
      {/* Left Panel - Questions & Config */}
      <div className="left-panel flex flex-col w-1/3 border-r border-[#1A1A1A] p-4">
        <div className="header mb-4 flex items-center space-x-2">
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
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

        <div className="content flex-1 overflow-auto">
          {/* Questions */}
          <div className="questions">
            <div className="text-sm text-gray-400 mb-2">Select a scenario for comparing LLMs.</div>
            <ul className="space-y-4">
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="bg-[#1A1A1A] p-4 rounded hover:bg-[#333333] cursor-pointer"
                  onClick={() => onQuestionSelect({ title: question.title, question: question.question, options: question.options })}
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="right-panel flex-1 flex flex-col p-4">
        <div className="messages flex-1 overflow-auto">
          {messages.length > 0 ? (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <div className="role">{message.role === "user" ? "User" : "Assistant"}</div>
                  <div className="content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isGeneratingState && (
                <div className="message">
                  <div className="role">Assistant</div>
                  <div className="flex items-center justify-center py-8 bg-[#1A1A1A] rounded-md">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
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

        {/* Chat Input */}
        <div className="input-container mt-4">
          <div className="input-wrapper relative flex items-end bg-[#1A1A1A] border border-[#333333] rounded transition-colors focus-within:border-[#666666]">
            <textarea
              autoFocus
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
              <Button size="icon" variant="ghost" className="button" onClick={handleClearChat}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <Button size="icon" onClick={handleSubmit} disabled={!input.trim() || isGeneratingState} className="submit-button bg-[#10A37F] hover:bg-[#0D8A6C] disabled:opacity-50">
                {isGeneratingState ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
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
