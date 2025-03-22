"use client"

import { useState, Fragment, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Eraser, ArrowLeft, CheckCircle, MessageCircle, Loader2, File } from "lucide-react"
import ChatInput from "@/components/chat-input"
import { Sliders, X } from "lucide-react"
import ModelPanel from "@/components/model-panel"
import SinglePanelView from "@/components/single-panel-view"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { documentStore } from "@/app/document_data";
import aiCcoreLogo from '@/components/ailogo.svg'
import PromptTechniques from "@/app/prompt-techniques"
import MainNavbar from "@/components/mainNavbar"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useApiStore } from "@/hooks/useApiStore"

// Progress bar steps
const steps = [
  { number: 1, label: "Select Model", isCompleted: true, isActive: false },
  { number: 2, label: "Select Question", isCompleted: false, isActive: true },
  { number: 3, label: "Compare Results", isCompleted: false, isActive: false }
];

const COMPARE_SINGLE = 0
const COMPARE_DOUBLE = 1
const COMPARE_TRIPLE = 2

export default function PlaygroundPage() {

  const [showDocumentPreview, setShowDocumentPreview] = useState(false)

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

  const toggleDocumentPreview = () => {
    setShowDocumentPreview(!showDocumentPreview)
  }

  const getDocumentFilename = () => {
    // Default to first document
    return "Mobile-Device-Policy.pdf"
  }

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
  // Add this state to track whether we're in discussion mode
  const [isDiscussMode, setIsDiscussMode] = useState(false);
  // Add this state to track ratings for each model
  const [modelRatings, setModelRatings] = useState<Record<string, Record<string, number>>>({});
  const [showRatingWarning, setShowRatingWarning] = useState(false);

  // Add this before the areAllRatingsComplete function
  useEffect(() => {
    console.log("Model ratings updated:", modelRatings);
  }, [modelRatings]);

  // Update the areAllRatingsComplete function with debug info
  const areAllRatingsComplete = () => {
    // Get models that have responses
    const modelsWithResponses = selectedModels.filter(model => {
      if (model === 'gpt-4o') return responses.A !== null;
      if (model === 'claude-3-7-sonnet-20250219') return responses.B !== null;
      if (model === 'gemini-2.0-flash') return responses.C !== null;
      return false;
    });

    console.log("Models with responses:", modelsWithResponses);

    // Check if all models have ratings
    const result = modelsWithResponses.every(model => {
      const ratings = modelRatings[model];
      console.log(`Checking ratings for ${model}:`, ratings);
      return ratings &&
        ratings.accuracy > 0 &&
        ratings.reasoning > 0 &&
        ratings.completeness > 0 &&
        ratings.clarity > 0 &&
        ratings.responseTime > 0;
    });

    console.log("All ratings complete:", result);
    return result;
  };

  // Handle rating changes from ModelPanel
  const handleRatingChange = (modelId: string, ratings: Record<string, number>) => {
    setModelRatings(prev => ({
      ...prev,
      [modelId]: ratings
    }));
    // Clear warning when users start rating
    setShowRatingWarning(false);
  };

  // Add this hook near your other state declarations
  const { getKey } = useApiStore()

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
        // Get the appropriate API key based on endpoint
        const apiKeyProvider = endpoint === 'openai' ? 'openai' : 
                              endpoint === 'anthropic' ? 'anthropic' : 'google';
        const apiKey = getKey(apiKeyProvider);

        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            // Add API key header if available
            ...(apiKey ? { "X-API-KEY": apiKey } : {})
          },
          body: JSON.stringify({
            prompt: conversationHistory,
            model,
            // Also include the API key in the request body as a fallback
            apiKey: apiKey
          }),
        });
      });

      const results = await Promise.all(fetchPromises)
      const dataPromises = results.map((res) => res.json())
      const data = await Promise.all(dataPromises)

      const newResponses = { ...responses }
      if (panelsToGenerate >= 1) {
        newResponses.A = data[0]?.text || null
        setMessages(prev => [...prev, { role: 'assistant', content: data[0]?.text || '', panelId: 'A' }])
      }
      if (panelsToGenerate >= 2) {
        newResponses.B = data[1]?.text || null
        setMessages(prev => [...prev, { role: 'assistant', content: data[1]?.text || '', panelId: 'B' }])
      }
      if (panelsToGenerate >= 3) {
        newResponses.C = data[2]?.text || null
        setMessages(prev => [...prev, { role: 'assistant', content: data[2]?.text || '', panelId: 'C' }])
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
    setPrompt(questionWithOptions);
    setIsGenerating(true);

    // Reset previous responses when starting a new comparison
    setResponses({
      A: null,
      B: null,
      C: null,
    });

    try {
      const conversationHistory = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nuser: ${questionWithOptions}`;

      // Define a mapping from model to panel ID
      const modelToPanelMapping: { [key: string]: string } = {
        "gpt-4o": "A",
        "claude-3-7-sonnet-20250219": "B",
        "gemini-2.0-flash": "C"
      };

      // Set all selected panels to generating state
      const newGeneratingState = { ...isGeneratingPanels };
      selectedModels.forEach(model => {
        const panelId = modelToPanelMapping[model];
        newGeneratingState[panelId] = true;
      });
      setIsGeneratingPanels(newGeneratingState);

      // Process each model in parallel
      selectedModels.forEach(async (model) => {
        const endpoint = modelToEndpointMapping[model];
        const panelId = modelToPanelMapping[model];
        
        // Get the appropriate API key based on endpoint
        const apiKeyProvider = endpoint === 'openai' ? 'openai' : 
                              endpoint === 'anthropic' ? 'anthropic' : 'google';
        const apiKey = getKey(apiKeyProvider);
        
        try {
          const response = await fetch(`/api/generate/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
              // Add API key header if available
              ...(apiKey ? { "X-API-KEY": apiKey } : {})
            },
            body: JSON.stringify({
              prompt: documentStore['Mobile-Device-Policy.pdf'] + conversationHistory,
              model,
              systemMessage: "Provide the correct option from A, B, C, D. Give clear and concise statement supporting your reason",
              // Also include the API key in the request body as a fallback
              apiKey: apiKey
            }),
          });

          // Handle non-200 responses
          if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }

          // Update the response for this specific panel
          setResponses(prev => ({
            ...prev,
            [panelId]: data.text
          }));

          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: data.text, panelId }
          ]);

        } catch (error) {
          console.error(`Error generating response for model ${model}:`, error);
          
          // Set error message as the response
          const errorMessage = 
           `**Response from the ${model} model is delayed**\n\n` +
            `The request is still processing and may take a bit longer.`;

          setResponses(prev => ({
            ...prev,
            [panelId]: errorMessage
          }));

          setMessages(prev => [
            ...prev,
            { role: 'assistant', content: errorMessage, panelId }
          ]);
        } finally {
          // Mark this panel as no longer generating
          setIsGeneratingPanels(prev => ({
            ...prev,
            [panelId]: false
          }));
        }
      });

    } catch (error) {
      console.error("Error in comparison setup:", error);
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

  // Set progress steps based on state
  const navSteps = [
    {
      number: 1,
      label: "Select LLM Model",
      isActive: compareCount === COMPARE_SINGLE && selectedModels.length < 2, // Active until at least 2 models are selected
      isCompleted: selectedModels.length >= 2 // Completed only when 2+ models are selected
    },
    {
      number: 2,
      label: "Select Scenario",
      isActive: compareCount === COMPARE_SINGLE && selectedModels.length >= 2 && !selectedQuestion, // Only active after step 1 is complete
      isCompleted: selectedQuestion !== null
    },
    {
      number: 3,
      label: "Compare Models",
      isActive: (compareCount === COMPARE_SINGLE && selectedModels.length >= 2 && selectedQuestion !== null) || compareCount > COMPARE_SINGLE,
      isCompleted: compareCount > COMPARE_SINGLE && responses.A !== null
    }
  ];

  // Add this helper function to check if we have any API responses
  const hasAnyResponses = () => {
    return responses.A !== null || responses.B !== null || responses.C !== null;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
        <MainNavbar
          title=""
          backUrl="/week1"
          backLabel="Back"
          onBack={() => {
            if (compareCount > COMPARE_SINGLE) {
              // Going back from comparison to selection view
              setCompareCount(COMPARE_SINGLE);
              // Reset responses when going back
              setResponses({
                A: null,
                B: null,
                C: null,
              });
              return; // Prevent navigation
            }
            // Otherwise, use default navigation to backUrl

            router.push('/week1')
          }}
          rightContent={
            <div className="flex items-center space-x-5">
              {/* Compare Models button with tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                  <Button
                    size="sm"
                    onClick={handleCompareClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
                    disabled={compareCount > COMPARE_SINGLE ? false : selectedModels.length < 2 || !selectedQuestion}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Compare Models
                  </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  {selectedModels.length < 2 ? "Please select at least 2 models to compare" : !selectedQuestion ? "Please select a scenario" : "Start comparison"}
                </TooltipContent>
              </Tooltip>

              {/* View Document button */}
              <Tooltip>
                 <TooltipTrigger asChild>
                   <span>
                    <Button
                      size="sm"
                      onClick={toggleDocumentPreview}
                      className="bg-indigo-700 hover:bg-indigo-900 text-white rounded-md h-9 flex items-center"
                        >
                      <File className="h-4 w-4" />
                      View Document
                    </Button>
                    </span>
               </TooltipTrigger>
               <TooltipContent side="bottom" align="center">
                This document is used as context for these scenarios.
                 </TooltipContent>
              </Tooltip>

              {/* Replace Discuss button with Complete Exercise (with tooltip) */}
              {compareCount > COMPARE_SINGLE && hasAnyResponses() ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        className="bg-indigo-700 hover:bg-indigo-900 text-white rounded-md h-9 flex items-center"
                        size="sm"
                        onClick={() => {
                          if (areAllRatingsComplete()) {
                            markExerciseComplete("exercise1");
                            router.push('/week1');
                          } else {
                            setShowRatingWarning(true);
                          }
                        }}
                        disabled={!areAllRatingsComplete()}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Complete Exercise
                      </Button>
                    </span>
       </TooltipTrigger>
                  <TooltipContent side="bottom" align="center">
                    {!areAllRatingsComplete() 
                      ? "Rate all models and wait for discussion before completing." 
                      : "Mark exercise as complete and return to Week 1"}
                  </TooltipContent >
                </Tooltip>
              ) : compareCount > COMPARE_SINGLE && !hasAnyResponses() ? (
                <Button
                  disabled
                  className="bg-blue-900/50 border border-blue-700/30 text-white flex items-center gap-2 opacity-70"
                >
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Waiting for responses...
                </Button>
              ) : null}
            </div>
          }
        />
        
        {/* Add progress bar here */}
        <div className="flex justify-center py-4 bg-gray-900/50 border-b border-gray-800">
          <div className="flex items-center">
            {navSteps.map((navStep, index) => (
              <Fragment key={navStep.number}>
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                      ${navStep.isActive
                        ? 'bg-indigo-600 text-white'
                        : navStep.isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                  >
                    {navStep.isCompleted && !navStep.isActive ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      navStep.number
                    )}
                  </div>
                  <span className={`text-xs ${navStep.isActive ? 'text-indigo-300 font-medium' : 'text-gray-400'}`}>
                    {navStep.label}
                  </span>
                </div>

                {/* Connector line between steps (except after the last step) */}
                {index < navSteps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 
                      ${navSteps.findIndex(step => step.isActive) > index ||
                        (index < navSteps.length - 1 && navSteps[index].isCompleted && navSteps[index + 1].isCompleted)
                        ? 'bg-green-600' : 'bg-gray-700'}`}
                  ></div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

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
                    className="overflow-hidden"
                    response={responses.A}
                    isGenerating={isGeneratingPanels.A}
                    prompt={prompt}
                    showResponseArea={true}
                    selectedModel="gpt-4o"
                    onRatingChange={handleRatingChange}
                    messages={messages.filter((m) => m.panelId === 'A')}
                  />
                )}
                {selectedModels.includes('claude-3-7-sonnet-20250219') && (
                  <ModelPanel
                    className={`overflow-hidden ${compareCount === COMPARE_TRIPLE ? "border-r border-gray-800/50" : ""}`}
                    response={responses.B}
                    isGenerating={isGeneratingPanels.B}
                    showResponseArea={true}
                    prompt={prompt}
                    selectedModel="claude-3-7-sonnet-20250219"
                    onRatingChange={handleRatingChange}  // Add this prop
                    messages={messages.filter((m) => m.panelId === 'B')}
                  />
                )}
                {selectedModels.includes('gemini-2.0-flash') && (
                  <ModelPanel
                    className="overflow-hidden"
                    response={responses.C}
                    isGenerating={isGeneratingPanels.C}
                    showResponseArea={true}
                    prompt={prompt}
                    selectedModel="gemini-2.0-flash"
                    onRatingChange={handleRatingChange}  // Add this prop
                    messages={messages.filter((m) => m.panelId === 'C')}
                  />
                )}
              </div>
            )
          ) : (
            <PromptTechniques />
          )}
        </div>

                {/* Add Clear Results button at the bottom when we have responses */}
        {compareCount > COMPARE_SINGLE && hasAnyResponses() && (
          <div className="sticky bottom-0 w-full p-3 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50 flex justify-center">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 px-4"
              onClick={() => {
                setResponses({
                  A: null,
                  B: null,
                  C: null,
                });
              }}
            >
              <Eraser className="h-4 w-4" />
              Clear Results
            </Button>
          </div>
        )}



        {/* Chat input - only shown in compare mode, placed outside of the panel view */}
        {/* {compareCount > COMPARE_SINGLE && (
          <div className="shrink-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
            <ChatInput onSubmit={handleSubmit} isGenerating={isGenerating} />
          </div>
        )} */}

        {/* Add warning message */}
        {showRatingWarning && (
          <div className="absolute top-16 right-4 bg-red-900/80 text-white px-4 py-2 rounded shadow-md z-20">
            Please complete all ratings before proceeding
          </div>
        )}

        <DocumentPreviewModal />
      </div>
    </TooltipProvider>
  )
}