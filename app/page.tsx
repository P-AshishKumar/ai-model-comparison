"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Eraser, Brain } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ModelPanel from "@/components/model-panel"
import SinglePanelView from "@/components/single-panel-view"
import PromptTechniques from "@/app/prompt-techniques"

interface Message {
  role: 'user' | 'assistant'
  content: string
  panelId?: 'A' | 'B' | 'C'
}

const COMPARE_SINGLE = 0
const COMPARE_DOUBLE = 1
const COMPARE_TRIPLE = 2

export default function AIPlayground() {
  const [compareCount, setCompareCount] = useState(COMPARE_SINGLE)
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [responses, setResponses] = useState<{
    A: string | null
    B: string | null
    C: string | null
  }>({
    A: null,
    B: null,
    C: null,
  })
  const [prompt, setPrompt] = useState("")
  const [models, setModels] = useState({
    A: 'gpt-4o',
    B: 'claude-3-7-sonnet-20250219',
    C: 'gemini-2.0-flash'
  })
  const [currentView, setCurrentView] = useState('playground') // State variable to manage the current view

  const handleSubmit = async (input: string) => {
    if (!input) return
    setPrompt(input)
    setIsGenerating(true)

    // Add user message to history
    const userMessage: Message = {
      role: 'user',
      content: input
    }
    setMessages(prev => [...prev, userMessage])

    try {
      // Generate responses based on how many panels are visible
      const panelsToGenerate = compareCount === COMPARE_SINGLE ? 1 : compareCount === COMPARE_DOUBLE ? 2 : 3

      // Create the conversation history as a single string
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${input}`

      const fetchPromises = []
      for (let i = 0; i < panelsToGenerate; i++) {
        const panelId = String.fromCharCode(65 + i) as 'A' | 'B' | 'C'
        const model = models[panelId]
        const [provider] = model.split('/')

        fetchPromises.push(
          fetch(`/api/generate/${provider}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: conversationHistory, model }),
          }),
        )
      }

      const results = await Promise.all(fetchPromises)
      const dataPromises = results.map((res) => res.json())
      const data = await Promise.all(dataPromises)

      // Update responses
      const newResponses = { ...responses }
      if (panelsToGenerate >= 1) {
        newResponses.A = data[0].text
        setMessages(prev => [...prev, { role: 'assistant', content: data[0].text, panelId: 'A' }])
      }
      if (panelsToGenerate >= 2) {
        newResponses.B = data[1].text
        setMessages(prev => [...prev, { role: 'assistant', content: data[1].text, panelId: 'B' }])
      }
      if (panelsToGenerate >= 3) {
        newResponses.C = data[2].text
        setMessages(prev => [...prev, { role: 'assistant', content: data[2].text, panelId: 'C' }])
      }

      setResponses(newResponses)
    } catch (error) {
      console.error("Error generating responses:", error)
      // Provide user feedback in the UI
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle question selection
  const handleQuestionSelect = async (question: { title: string, question: string, options: string[] }) => {
    setPrompt(question.question)
    setCompareCount(COMPARE_TRIPLE) // Switch to multiple view response

    try {
      setIsGenerating(true)

      // Create the conversation history as a single string
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${question.question}`

      const fetchPromises = ["A", "B", "C"].map(panelId =>
        fetch(`/api/generate/${panelId === "A" ? "openai" : panelId === "B" ? "anthropic" : "google"}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: conversationHistory,
            model: panelId === "A" ? "gpt-4o" : panelId === "B" ? "claude-3-7-sonnet-20250219" : "gemini-2.0-flash",
          }),
        })
      )

      const results = await Promise.all(fetchPromises)
      const data = await Promise.all(results.map(res => res.json()))

      setResponses({
        A: data[0].text,
        B: data[1].text,
        C: data[2].text,
      })
    } catch (error) {
      console.error("Error generating responses:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle clearing all chat content
  const handleClearChat = () => {
    setResponses({
      A: null,
      B: null,
      C: null,
    })
    setPrompt("")
    setMessages([])
  }

  // Handle compare button click
  const handleCompareClick = () => {
    setCompareCount((prev) => (prev >= COMPARE_TRIPLE ? COMPARE_SINGLE : prev + 1))
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0D0D0D]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b border-[#1A1A1A] shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-white font-semibold text-lg">
            <span className="flex items-center justify-center h-6 w-6 mr-2 bg-blue-600 rounded-sm">
              <Brain className="h-4 w-4 text-white" />
            </span>
            <span className="text-gray-400">AI-CCORE</span>
            <span className="mx-0.5 text-gray-600"></span>
            <span>Playground</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCompareClick} className="text-gray-400 hover:text-white">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            {compareCount === COMPARE_SINGLE ? "Compare Models" : compareCount === COMPARE_DOUBLE ? "Compare Models(2)" : "Main View"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={handleClearChat}
          >
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setCurrentView('prompt-techniques')} // Switch to PromptTechniques view
          >
            Prompt Techniques
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'playground' ? (
          compareCount === COMPARE_SINGLE ? (
            <SinglePanelView
              className="overflow-auto flex-1"
              response={responses.A}
              isGenerating={isGenerating}
              prompt={prompt}
              onSubmit={handleSubmit}
              messages={messages}
              onQuestionSelect={handleQuestionSelect}
            />
          ) : (
            <>
              <div className={`grid ${compareCount === COMPARE_DOUBLE ? "grid-cols-2" : "grid-cols-3"} gap-0 h-[calc(100vh-180px)] overflow-hidden`}>
                <ModelPanel
                  panelId="A"
                  className="overflow-auto"
                  response={responses.A}
                  isGenerating={isGenerating}
                  prompt={prompt}
                  showResponseArea={true}
                  messages={messages.filter(m => !m.panelId || m.panelId === 'A')}
                  selectedModel={models.A}
                  onModelChange={(model) => setModels(prev => ({ ...prev, A: model }))}
                />

                <ModelPanel
                  panelId="B"
                  className="overflow-auto"
                  response={responses.B}
                  isGenerating={isGenerating}
                  prompt={prompt}
                  showResponseArea={true}
                  messages={messages.filter(m => !m.panelId || m.panelId === 'B')}
                  selectedModel={models.B}
                  onModelChange={(model) => setModels(prev => ({ ...prev, B: model }))}
                />

                {compareCount >= COMPARE_TRIPLE && (
                  <ModelPanel
                    panelId="C"
                    className="overflow-auto"
                    response={responses.C}
                    isGenerating={isGenerating}
                    prompt={prompt}
                    showResponseArea={true}
                    messages={messages.filter(m => !m.panelId || m.panelId === 'C')}
                    selectedModel={models.C}
                    onModelChange={(model) => setModels(prev => ({ ...prev, C: model }))}
                  />
                )}
              </div>
            </>
          )
        ) : (
          <PromptTechniques /> // Render PromptTechniques component
        )}

        {/* Chat input - only shown in compare mode */}
        {compareCount > COMPARE_SINGLE && (
          <div className="shrink-0 p-4 border-t border-[#1A1A1A]">
            <ChatInput onSubmit={handleSubmit} isGenerating={isGenerating} />
          </div>
        )}
      </div>
    </div>
  )
}

