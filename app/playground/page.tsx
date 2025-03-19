"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Eraser, ArrowLeft } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ModelPanel from "@/components/model-panel"
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
  const [isGeneratingPanels, setIsGeneratingPanels] = useState<{ [key: string]: boolean }>({
    A: false,
    B: false,
    C: false,
  });

  const modelToEndpointMapping: { [key: string]: string } = {
    "gpt-4o": "openai",
    "claude-3-7-sonnet-20250219": "anthropic",
    "gemini-2.0-flash": "google"
  };

  const [currentView, setCurrentView] = useState('playground')

  // Function to handle the message submission
  const handleSubmit = async (input: string) => {
    if (!input) return;
    setPrompt(input);
    setIsGenerating(true);

    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const conversationHistory = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${input}`;

      const fetchPromises = selectedModels.map((model, index) => {
        const endpoint = modelToEndpointMapping[model];
        const startTime = performance.now();
        const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C
        setIsGeneratingPanels(prev => ({ ...prev, [panelId]: true }));
        return fetch(`/api/generate/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: conversationHistory,
            model,
          }),
        }).then(response => {
          const endTime = performance.now();
          return response.json().then(data => ({
            model,
            text: data.text,
            responseTime: endTime - startTime,
          }));
        }).catch(error => {
          if (error.name === 'AbortError') {
            console.log(`Request for ${model} aborted due to timeout`);
            return null;
          }
          throw error;
        });
      });

      fetchPromises.forEach(async (fetchPromise, index) => {
        try {
          const result = await fetchPromise;
          if (result) {
            const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C

            setResponses(prevResponses => ({
              ...prevResponses,
              [panelId]: result.text,
            }));

            setMessages(prevMessages => [
              ...prevMessages,
              { role: 'assistant', content: result.text, panelId },
            ]);

            console.log(`Response for ${panelId} received in ${result.responseTime.toFixed(2)} ms`);
          }
        } catch (error) {
          console.error(`Error generating response for model ${selectedModels[index]}:`, error);
        } finally {
          const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C
          setIsGeneratingPanels(prev => ({ ...prev, [panelId]: false }));
        }
      });
    } catch (error) {
      console.error('Error generating responses:', error);
    } finally {
      setIsGenerating(false);
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
    setIsGenerating(true);

    try {
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${questionWithOptions}`;

      // Create an AbortController for each request
      const controllers = selectedModels.map(() => new AbortController());

      const fetchPromises = selectedModels.map((model, index) => {
        const endpoint = modelToEndpointMapping[model];
        const startTime = performance.now();
        const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C
        setIsGeneratingPanels(prev => ({ ...prev, [panelId]: true }));
        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add caching headers
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          signal: controllers[index].signal, // Add abort signal
          body: JSON.stringify({
            prompt: conversationHistory,
            model,
            filePath: "Mobile-Device-Policy.pdf",
            systemMessage: "Provide the correct option from A, B, C, D. give clear and concise answer",
          }),
        }).then(response => {
          const endTime = performance.now();
          return response.json().then(data => ({
            model,
            text: data.text,
            responseTime: endTime - startTime,
          }));
        }).catch(error => {
          if (error.name === 'AbortError') {
            console.log(`Request for ${model} aborted due to timeout`);
            return null;
          }
          throw error;
        });
      });

      // Set timeout to abort requests after 15 seconds
      setTimeout(() => {
        controllers.forEach(controller => controller.abort());
      }, 15000);

      fetchPromises.forEach(async (fetchPromise, index) => {
        try {
          const result = await fetchPromise;
          if (result) {
            const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C

            setResponses(prevResponses => ({
              ...prevResponses,
              [panelId]: result.text,
            }));

            setMessages(prevMessages => [
              ...prevMessages,
              { role: 'assistant', content: result.text, panelId },
            ]);

            console.log(`Response for ${panelId} received in ${result.responseTime.toFixed(2)} ms`);
          }
        } catch (error) {
          console.error(`Error generating response for model ${selectedModels[index]}:`, error);
        } finally {
          const panelId = String.fromCharCode(65 + index); // Convert 0,1,2 to A,B,C
          setIsGeneratingPanels(prev => ({ ...prev, [panelId]: false }));
        }
      });
    } catch (error) {
      console.error("Error generating responses:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      <header className="flex items-center justify-between px-4 h-14 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 shrink-0">
        <div className="w-24">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center text-white font-semibold text-lg">
          <Image
            src={aiCcoreLogo}
            alt="AI-CCORE Logo"
            width={24}
            height={24}
            className="mr-2"
          />
          <span className="text-gray-400">AI-CCORE</span>
          <span className="mx-0.5 text-gray-600"></span>
          <span>Playground</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCompareClick} className="text-gray-400 hover:text-white" disabled={selectedModels.length < 2}>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Compare Models
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
              response={responses.A}
              isGenerating={isGenerating}
              prompt={prompt}
              onSubmit={handleSubmit}
              messages={messages}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestion={selectedQuestion}
              setSelectedModels={setSelectedModels}  // Pass function to allow model selection
              selectedModels={selectedModels}  // Pass selected models
            />
          ) : (
            <div className={`grid ${compareCount === COMPARE_DOUBLE ? "grid-cols-2" : "grid-cols-3"} gap-0 h-[calc(100vh-180px)] overflow-hidden`}>
              {selectedModels.includes('gpt-4o') && (
                <ModelPanel
                  className="overflow-auto border-r border-gray-800/50"
                  response={responses.A}
                  isGenerating={isGeneratingPanels.A}
                  prompt={prompt}
                  showResponseArea={true}
                  selectedModel="gpt-4o"
                  messages={messages.filter((m) => m.panelId === 'A')}
                />
              )}
              {selectedModels.includes('claude-3-7-sonnet-20250219') && (
                <ModelPanel
                  className={`overflow-auto ${compareCount === COMPARE_TRIPLE ? "border-r border-gray-800/50" : ""}`}
                  response={responses.B}
                  isGenerating={isGeneratingPanels.B}
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
                  isGenerating={isGeneratingPanels.C}
                  showResponseArea={true}
                  prompt={prompt}
                  selectedModel="gemini-2.0-flash"
                  messages={messages.filter((m) => m.panelId === 'C')}
                />
              )}
            </div>
          )
        ) : (
          <PromptTechniques />
        )}
      </div>
      {/* Chat input - only shown in compare mode, placed outside of the panel view */}
      {/* {compareCount > COMPARE_SINGLE && (
        <div className="shrink-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
          <ChatInput onSubmit={handleSubmit} isGenerating={isGenerating} />
        </div>
      )} */}
    </div>
  )
}