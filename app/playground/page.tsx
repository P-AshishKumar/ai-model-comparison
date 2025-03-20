"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Eraser, ArrowLeft, CheckCircle } from "lucide-react"
import ChatInput from "@/components/chat-input"
import { ModelPanel, ModelPanelHeader } from "@/components/model-panel"
import SinglePanelView from "@/components/single-panel-view"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import aiCcoreLogo from '@/components/ailogo.svg'
import PromptTechniques from "@/app/prompt-techniques"

const COMPARE_SINGLE = 0
const COMPARE_DOUBLE = 1
const COMPARE_TRIPLE = 2

export default function PlaygroundPage() {
  const router = useRouter()
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
  const [selectedQuestion, setSelectedQuestion] = useState<{ title: string, question: string, options: string[] } | null>(null)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  
  // Add the markExerciseComplete function here
  const markExerciseComplete = (exerciseId: string) => {
    // Get current completed exercises
    const storedCompletedExercises = localStorage.getItem('completedExercises') || '[]';
    const completedExercises = JSON.parse(storedCompletedExercises);
    
    // Add the current exercise if not already included
    if (!completedExercises.includes(exerciseId)) {
      completedExercises.push(exerciseId);
      localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
    }
  };

  const modelToEndpointMapping: { [key: string]: string } = {
    "gpt-4o": "openai",
    "claude-3-7-sonnet-20250219": "anthropic",
    "gemini-2.0-flash": "google"
  };

  const [currentView, setCurrentView] = useState('playground')
  // Function to handle the message submission
  const handleSubmit = async (input: string) => {
    if (!input) return
    setPrompt(input)
    setIsGenerating(true)

    const userMessage: Message = {
      role: 'user',
      content: input
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const panelsToGenerate = compareCount === COMPARE_SINGLE ? 1 : compareCount === COMPARE_DOUBLE ? 2 : 3

      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${input}`

      const fetchPromises = selectedModels.map((model, index) => {
        const endpoint = modelToEndpointMapping[model];
        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: conversationHistory,
            model,
          }),
        });
      });

      const results = await Promise.all(fetchPromises)
      const dataPromises = results.map((res) => res.json())
      const data = await Promise.all(dataPromises)

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
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuestionSelect = (question: { title: string, question: string, options: string[] }) => {
    setSelectedQuestion(question) // Update selected question
  }

  const handleCompareClick = () => {
    console.log("Question for comparing", selectedQuestion)
    if (selectedModels.length >= 2) {
      setCompareCount(selectedModels.length === 2 ? COMPARE_DOUBLE : COMPARE_TRIPLE)
      console.log("setcomparecount", compareCount)
      compareQuestionSelect(selectedQuestion)  // Trigger comparison based on selected models
    } else {
      console.log("Please select at least two models to compare.")
    }
  }

  const compareQuestionSelect = async (question: { title: string, question: string, options: string[] }) => {
    const questionWithOptions = `${question.question}\nOptions:\n${question.options.join('\n')}`;

    // Update the prompt state with the question and options
    setPrompt(questionWithOptions);
    setIsGenerating(true)

    try {
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${questionWithOptions}`
      
      // Get the uploaded document name from localStorage
      const uploadedDocument = localStorage.getItem('uploadedDocumentName') || "Mobile-Device-Policy.pdf";

      const fetchPromises = selectedModels.map((model, index) => {
        const endpoint = modelToEndpointMapping[model];
        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: conversationHistory,
            model,
            filePath: uploadedDocument, // Use the uploaded document
            systemMessage: "Provide the correct option from A, B, C, D. give clear and concise answer"
          }),
        });
      });

      const results = await Promise.all(fetchPromises)
      console.log("Result", results)
      const data = await Promise.all(results.map(res => res.json()))

      setResponses({
        A: data[0]?.text || null,
        B: data[1]?.text || null,
        C: data[2]?.text || null,
      })
      console.log("Set Response", data[0].text)
      console.log("Set Response", data[1].text)
      console.log("Set Response", data[2].text)
    } catch (error) {
      console.error("Error generating responses:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearChat = () => {
    setResponses({
      A: null,
      B: null,
      C: null,
    })
    setPrompt("")
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'playground' ? (
          compareCount === COMPARE_SINGLE ? (
            <SinglePanelView
              response={responses.A}
              isGenerating={isGenerating}
              prompt={prompt}
              onSubmit={handleSubmit}
              messages={messages}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestion={selectedQuestion}
              setSelectedModels={setSelectedModels}  // Pass function to allow model selection
              selectedModels={selectedModels}  // Pass selected models
              onCompareClick={() => {
                if (selectedModels.length >= 2 && selectedQuestion) {
                  setCompareCount(selectedModels.length === 2 ? COMPARE_DOUBLE : COMPARE_TRIPLE);
                  compareQuestionSelect(selectedQuestion);
                }
              }}
            />
          ) : (
            <>
              <div className="h-svh flex flex-col">
                <ModelPanelHeader>
                  <div className={`grid ${compareCount === COMPARE_DOUBLE ? "grid-cols-2" : "grid-cols-3"} gap-0 h-[calc(100vh-220px)] overflow-hidden`}>
                    {selectedModels.includes('gpt-4o') && (
                      <ModelPanel
                        className="overflow-auto border-r border-gray-800/50"
                        response={responses.A}
                        isGenerating={isGenerating}
                        prompt={prompt}
                        showResponseArea={true}
                        selectedModel="gpt-4o"
                        messages={messages.filter((m) => m.panelId === 'A')}
                        isLastPanel={compareCount === COMPARE_DOUBLE && !selectedModels.includes('claude-3-7-sonnet-20250219')}
                      />
                    )}
                    {selectedModels.includes('claude-3-7-sonnet-20250219') && (
                      <ModelPanel
                        className={`overflow-auto ${compareCount === COMPARE_TRIPLE ? "border-r border-gray-800/50" : ""}`}
                        response={responses.B}
                        isGenerating={isGenerating}
                        showResponseArea={true}
                        prompt={prompt}
                        selectedModel="claude-3-7-sonnet-20250219"
                        messages={messages.filter((m) => m.panelId === 'B')}
                      />
                    )}
                    {selectedModels.includes('gemini-2.0-flash') && (
                      <ModelPanel
                        className="overflow-auto"
                        response={responses.C}
                        isGenerating={isGenerating}
                        showResponseArea={true}
                        prompt={prompt}
                        selectedModel="gemini-2.0-flash"
                        messages={messages.filter((m) => m.panelId === 'C')}
                      />
                    )}
                  </div>
                </ModelPanelHeader>
              </div>
              
              {/* Add this before the chat input but only when in compare mode */}
              <div className="shrink-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm flex justify-end">
                <Button 
                  onClick={() => {
                    markExerciseComplete("exercise1");
                    router.push('/week1'); // Go back to exercises page
                  }}
                  className="bg-blue-900 hover:bg-blue-800 border border-blue-700/30 shadow-sm hover:shadow-[0_0_10px_rgba(30,64,175,0.4)] transition-all duration-300 text-white flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Complete Exercise
                </Button>
              </div>
            </>
          )
        ) : (
          <PromptTechniques />
        )}
      </div>
      
      {/* Chat input at the bottom */}
      {compareCount > COMPARE_SINGLE && (
        <div className="shrink-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <ChatInput onSubmit={handleSubmit} isGenerating={isGenerating} />
        </div>
      )}
    </div>
  )
}
