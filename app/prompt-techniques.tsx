"use client"

import React, { useState, useRef, useEffect, Fragment } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Upload, File, X } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { questions } from "@/components/prompt-question"
import MainNavbar from "@/components/MainNavbar"
import aiCcoreLogo from '@/components/ailogo.svg'

// Define model-to-endpoint mapping
const modelToEndpointMapping: { [key: string]: string } = {
  "gpt-4o": "openai",
  "claude-3-7-sonnet-20250219": "anthropic",
  "gemini-2.0-flash": "google"
};

// Available models (showing only one for simplicity)
const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI)' }
];

// Add this interface at the top
interface Exercise2PageProps {
  initialFileName?: string | null;
  onScenarioChange?: (scenarioId: number) => void;
}

export default function Exercise2Page({ initialFileName = null, onScenarioChange }: Exercise2PageProps) {
  const router = useRouter()
  // Start from step 2 (Choose Scenario) instead of step 1 (Upload Document)
  const [step, setStep] = useState(2) // Changed initial state from 1 to 2
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<{ id: number, title: string, question: string, promptTechnique: any[] } | null>(null)

  // Model is fixed to GPT-4o
  const selectedModel = 'gpt-4o'

  // Modified responses state to store all responses
  const [responses, setResponses] = useState<{ [key: string]: string | null }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingTechnique, setGeneratingTechnique] = useState<string | null>(null)

  const [uploadedFileName, setUploadedFileName] = useState<string | null>("Mobile-Device-Policy.pdf") // Set a default file name

  // Refs for auto-scrolling
  const responsesRef = useRef<HTMLDivElement>(null)

  // Add state for document preview
  const [showDocumentPreview, setShowDocumentPreview] = useState(false)

  // Get current prompt techniques based on selected question
  const getCurrentPromptTechniques = () => {
    if (!selectedQuestion) return [];
    return selectedQuestion.promptTechnique || [];
  }

  // Load the file and move to step 2 if a file is already provided
  useEffect(() => {
    if (initialFileName) {
      setUploadedFileName(initialFileName)
    }
  }, [initialFileName])

  // Auto-scroll when responses change
  useEffect(() => {
    if (Object.keys(responses).length > 0 && responsesRef.current) {
      responsesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [responses]);

  // Function to mark exercise as complete
  const markExerciseComplete = (exerciseId: string) => {
    try {
      const storedCompletedExercises = localStorage.getItem('completedExercises') || '[]';
      const completedExercises = JSON.parse(storedCompletedExercises);

      if (!completedExercises.includes(exerciseId)) {
        completedExercises.push(exerciseId);
        localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
      }
    } catch (error) {
      console.error("Error updating completed exercises:", error);
    }
  };

  // Add this function to get the document name based on current scenario
  const getDocumentFilename = () => {
    if (!selectedQuestion) return "Mobile-Device-Policy.pdf";

    // Map scenario IDs to their respective PDF files
    const scenarioDocumentMap: Record<number, string> = {
      1: 'Mobile-Device-Policy.pdf',
      2: 'Password-Policy.pdf'
    }

    return scenarioDocumentMap[selectedQuestion.id] || 'Mobile-Device-Policy.pdf'
  }

  // Toggle document preview visibility
  const toggleDocumentPreview = () => {
    setShowDocumentPreview(!showDocumentPreview)
  }

  // Update the handleScenarioSelect function to reset responses
  const handleScenarioSelect = (question: { id: number, title: string, question: string, promptTechnique: any[] }) => {
    setSelectedQuestion(question);
    setSelectedScenario(question.question);

    // Notify parent component about scenario change if callback exists
    if (onScenarioChange) {
      onScenarioChange(question.id);
    }

    // Clear previous responses when selecting a new scenario
    setResponses({});
    setStep(3);
  };

  // Fix the handleCompare function to properly show loading indicators for both techniques simultaneously
  const handleCompare = async () => {
    if (!selectedScenario || !selectedQuestion) return;

    setIsGenerating(true);
    // Set both techniques as generating simultaneously
    setGeneratingTechnique('both');

    try {
      // Get the first two prompt techniques from the selected scenario
      const techniques = selectedQuestion.promptTechnique.slice(0, 2);
      if (techniques.length < 2) return;

      // Create an array of promises for both API calls
      const responsePromises = techniques.map(technique => {
        const endpoint = modelToEndpointMapping[selectedModel];

        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: technique.prompt(selectedScenario),
            model: selectedModel,
            systemMessage: "You are an evaluator analyzing policies. Give a clear Yes or No answer with brief reasoning.",
            filePath: selectedQuestion.id === 1 ? "Mobile-Device-Policy.pdf" : "Password-Policy.pdf"
          }),
        })
          .then(response => response.json())
          .then(data => ({ techniqueId: technique.id, text: data.text || "No response received" }));
      });

      // Process responses as they complete
      const results = await Promise.all(responsePromises);

      // Update all responses at once to prevent UI flickering
      const newResponses = { ...responses };
      results.forEach(result => {
        if (result) {
          newResponses[result.techniqueId] = result.text;
        }
      });

      setResponses(newResponses);

    } catch (error) {
      console.error("Error generating responses:", error);
      alert("Error generating responses. Please try again.");
    } finally {
      setIsGenerating(false);
      setGeneratingTechnique(null);
    }
  };

  // Handle back navigation based on current step
  const handleBackNavigation = () => {
    if (step === 2) {
      // If on scenario selection, go back to week1
      router.push('/week1');
    } else if (step === 3) {
      // If on prompt comparison, go back to scenario selection
      setStep(2);
    }
  };

  // Define steps for the navbar
  const navSteps = [
    { number: 1, label: "Choose Scenario", isActive: step === 2, isCompleted: step > 2 },
    { number: 2, label: "Compare Prompts", isActive: step === 3, isCompleted: false }
  ];

  // Get the appropriate title based on the current step
  const getNavbarTitle = () => {
    switch (step) {
      case 2: return "Choose Scenario";
      case 3: return selectedQuestion?.title || "Compare Prompts";
      default: return "Prompt Engineering";
    }
  };

  // Get the appropriate back label based on the current step
  const getBackLabel = () => {
    if (step === 2) return "Back";
    return "Back";
  };

  // Show completion button when responses are available
  const showCompleteButton = step === 3 && Object.keys(responses).length > 0;

  // Format prompt to highlight examples in few-shot and chain-of-thought
  const formatPrompt = (prompt: string, techniqueId: string) => {
    if (techniqueId === 'zero-shot') {
      return <span>{prompt}</span>;
    } else if (techniqueId === 'few-shot') {
      // Split the prompt to separate examples from the question
      const parts = prompt.split(/\n\nNow answer the below question:/i);
      if (parts.length === 2) {
        return (
          <>
            <div className="font-black text-0.9g mb-4 block p-3 mb-4 border rounded bg-indigo-950/40">
              {/* <span className="text-indigo-300 font-medium mb-1 block"></span> */}
              {parts[0]}
            </div>
            <div>
              {/* <span className="text-gray-400 font-medium mb-1 block">Question:</span> */}
              {parts[1]}
            </div>
          </>
        );
      }
    } else if (techniqueId === 'chain-of-thought') {
      // Split the prompt to separate the thinking steps from the question
      const parts = prompt.split(/\n\nThink through:/i);
      if (parts.length === 2) {
        const [question, thinking] = parts;
        const finalParts = thinking.split(/\n\nBased on your analysis/i);

        return (
          <>
            <div>
              {/* <span className="text-gray-400 font-medium mb-1 block">Question:</span> */}
              {question}
            </div>
            <div className="bg-indigo-950/40 p-3 my-4 border border-indigo-800/40 rounded">
              <span className="text-indigo-300 font-medium mb-1 block">Thinking Steps:</span>
              {finalParts[0]}
            </div>
            {finalParts.length > 1 && (
              <div>
                <span className="text-gray-400 font-medium mb-1 block">Assessment:</span>
                Based on your analysis{finalParts[1]}
              </div>
            )}
          </>
        );
      }
    }

    return <span>{prompt}</span>;
  };

  // Helper function to render a technique card
  const renderTechniqueCard = (techniqueId: string, index: number) => {
    if (!selectedQuestion) return null;

    const technique = selectedQuestion.promptTechnique.find(t => t.id === techniqueId);
    if (!technique) return null;

    // Show loading when generatingTechnique is 'both' or the specific techniqueId
    const isLoading = isGenerating && (generatingTechnique === 'both' || generatingTechnique === techniqueId);
    const hasResponse = responses[techniqueId] !== undefined;

    return (
      <div className="bg-gray-900/60 rounded-lg border border-gray-800/50 overflow-hidden h-full flex flex-col">
        <div className="bg-gray-800/80 p-3 flex justify-between items-center">
          <div>
            <h3 className="text-white font-medium">{technique.title}</h3>
            <p className="text-gray-400 text-xs mt-1">Technique {index + 1}</p>
          </div>
          <div className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded font-mono">
            PROMPT
          </div>
        </div>

        <div className="p-4 border-b border-gray-800/30">
          <div className="bg-black/30 p-4 rounded text-sm font-mono text-gray-300 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {formatPrompt(technique.prompt(selectedScenario || ''), techniqueId)}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800/80 p-3 flex justify-between items-center">
            <h3 className="text-white font-medium">Response</h3>
            <div className="flex items-center gap-2">
              {hasResponse && (
                <span className="text-xs text-gray-400">
                  GPT-4o
                </span>
              )}
              <div className="bg-blue-900/40 text-blue-400 text-xs px-2 py-1 rounded font-mono">
                RESPONSE
              </div>
            </div>
          </div>

          <div className="p-4 flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
                  <p className="text-indigo-300 text-sm">Generating response...</p>
                </div>
              </div>
            ) : hasResponse ? (
              <div className="text-white whitespace-pre-wrap h-full">{responses[techniqueId]}</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-400 italic text-center mb-3">
                  Response not yet generated
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (step) {
      case 2: // Choose Scenario
        return (
          <div className="flex flex-col max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Choose a Scenario</h2>
              <p className="text-gray-400">
                Select a scenario to compare different prompt engineering techniques
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 relative ${selectedQuestion?.id === question.id
                    ? 'bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                    : 'bg-gray-900/80 border border-gray-800/50 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    }`}
                  onClick={() => handleScenarioSelect(question)}
                >
                  {/* Add a highlight indicator for selected scenario */}
                  {selectedQuestion?.id === question.id && (
                    <div className="absolute top-3 right-2">
                      <span className="bg-green-600/40 text-green-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Selected
                      </span>
                    </div>
                  )}

                  <h3 className={`text-xl font-semibold mb-2 ${selectedQuestion?.id === question.id ? 'text-white' : 'text-gray-200'
                    }`}>
                    {question.id}: {question.title}
                  </h3>
                  <p className={`mb-4 ${selectedQuestion?.id === question.id ? 'text-gray-200' : 'text-gray-300'
                    }`}>
                    {question.question}
                  </p>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScenarioSelect(question);
                      }}
                      className={`${selectedQuestion?.id === question.id
                        ? 'bg-indigo-500 hover:bg-indigo-600'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        } text-white`}
                    >
                      {selectedQuestion?.id === question.id ? (
                        <>Proceed <ArrowRight className="ml-2 h-3 w-3" /></>
                      ) : (
                        <>Select Scenario <ArrowRight className="ml-2 h-3 w-3" /></>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Compare Techniques without dropdowns
        return (
          <div className="flex flex-col max-w-7xl mx-auto px-4" ref={responsesRef}>
            <div className="mb-8">
              {/* Configuration panel */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-medium text-white mb-4">Scenario   {selectedQuestion?.id}: {selectedQuestion?.title}</h3>
                <p className="text-gray-300 mb-6">{selectedQuestion?.question}</p>

                {/* Fixed techniques and model display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      First Technique
                    </label>
                    <div className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white">
                      {selectedQuestion?.promptTechnique[0]?.title || 'Zero-shot Prompting'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Second Technique
                    </label>
                    <div className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white">
                      {selectedQuestion?.promptTechnique[1]?.title || 'Few-shot Prompting'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      LLM Model
                    </label>
                    <div className="bg-gray-800 border border-gray-700 rounded-md p-2 text-white">
                      GPT-4o (OpenAI)
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleCompare}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Generating with GPT-4o...
                      </div>
                    ) : (
                      "Compare Techniques"
                    )}
                  </Button>
                </div>
              </div>

              {/* Technique comparison results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-9 h-[600px]">
                {/* First Technique Card */}
                {renderTechniqueCard(selectedQuestion?.promptTechnique[0]?.id || 'zero-shot', 0)}

                {/* Second Technique Card */}
                {renderTechniqueCard(selectedQuestion?.promptTechnique[1]?.id || 'few-shot', 1)}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Add document preview modal component
  const DocumentPreviewModal = () => {
    if (!showDocumentPreview) return null;

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
    );
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      <MainNavbar
        title={""}
        backUrl={step === 2 ? '/week1' : undefined}
        backLabel={getBackLabel()}
        onBack={handleBackNavigation}
        rightContent={showCompleteButton ? (
          <Button
            onClick={() => {
              markExerciseComplete("exercise2");
              router.push('/week1');
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Complete Exercise
          </Button>
        ) : undefined}
      />

      {/* Exercise title and nav steps */}
      <div className="container mx-auto px-4 py-3 border-b border-gray-800/50">
        {/* Nav steps with document preview button on the right */}
        <div className="flex justify-between items-center">
          {/* Left side - empty space or logo if you want */}
          <div className="w-10"></div>

          {/* Center - progress steps */}
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
                    {navStep.isCompleted ? (
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
                      ${index < step - 2 ? 'bg-green-600' : 'bg-gray-700'}`}
                  ></div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Right side - document preview button */}
          <Button
            onClick={toggleDocumentPreview}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
            aria-label="Preview Document"
          >
            <File className="h-4 w-4" />
            <span className="text-sm">View Document</span>
          </Button>
        </div>
      </div>

      <div className="text-center mb-6 mt-4">
        <h2 className="text-xl md:text-2xl font-semibold text-white">Exercise 2 <span className="text-indigo-400">Prompt Engineering</span></h2>
      </div>

      <div className="flex-1 overflow-auto">
        <main className="container mx-auto py-8">
          {renderStepContent()}
        </main>
      </div>

      {/* Add the document preview modal */}
      <DocumentPreviewModal />

      <footer className="border-t border-gray-800/50 py-6 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}