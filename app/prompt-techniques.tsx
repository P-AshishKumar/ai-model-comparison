"use client"

import React, { useState, useRef, useEffect, Fragment } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Upload } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { questions } from "@/components/prompt-question"
import PromptTechniquePanel from "@/components/PromptTechniquePanel"
import MainNavbar from "@/components/MainNavbar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the prompt techniques
const PROMPT_TECHNIQUES = [
  {
    id: 'zero-shot',
    title: 'Zero-shot Prompting',
    prompt: (question: string) => `Question: ${question} Please give me a yes or no answer.`,
  },
  {
    id: 'few-shot',
    title: 'Few-shot Prompting',
    prompt: (question: string) => `Example1: I have a Blackberry 2012 that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is yes because blackberry 2012 no longer receives updates from the vendor and hence is a security risk.\n\nExample 2: I have a Samsung 2024 with original OS that I want to use as a personal device and connect to university devices. Would using this device violate the mobile-device policy? Please give me a yes or no answer. The answer is no because its OS is original, and it received updates. Now give me the answer for this question:\n\n${question} Please give me a yes or no answer.`,
  },
  {
    id: 'role-based',
    title: 'Role-based Prompting',
    prompt: (question: string) => `You are a university IT compliance officer evaluating device requests. Your role is to determine if devices comply Mobile Device Management Policy. Please give me only yes or no as the answer. ${question}`,
  },
  {
    id: 'chain-of-thought',
    title: 'Chain-of-thought Prompting',
    prompt: (question: string) => `Determine whether using a Nokia 2017 phone to connect to university resources would violate Mobile Device Management Policy. Think through this step-by-step and answer yes or no:\n\nQuestion: ${question} Step 1: First, identify what the policy says about personally owned devices. Step 2: Check if there are OS requirements for personally owned devices. Step 3: Consider whether this device can still receive vendor updates.`,
  },
]

// Define model-to-endpoint mapping
const modelToEndpointMapping: { [key: string]: string } = {
  "gpt-4o": "openai",
  "claude-3-7-sonnet-20250219": "anthropic",
  "gemini-2.0-flash": "google"
};

// Define available models
const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (OpenAI)' },
  { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }
]

// Add this interface at the top
interface Exercise2PageProps {
  initialFileName?: string | null
}

export default function Exercise2Page({ initialFileName = null }: Exercise2PageProps) {
  const router = useRouter()
  // Start from step 2 (Choose Scenario) instead of step 1 (Upload Document)
  const [step, setStep] = useState(2) // Changed initial state from 1 to 2
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<{id: number, title: string, question: string} | null>(null)
  
  // State for technique comparison
  const [leftTechnique, setLeftTechnique] = useState<string>('zero-shot')
  const [rightTechnique, setRightTechnique] = useState<string>('few-shot')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o')
  
  // Modified responses state to store all responses
  const [responses, setResponses] = useState<{ [key: string]: string | null }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingTechnique, setGeneratingTechnique] = useState<string | null>(null)
  
  const [uploadedFileName, setUploadedFileName] = useState<string | null>("Mobile-Device-Policy.pdf") // Set a default file name
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Load the file and move to step 2 if a file is already provided
  useEffect(() => {
    if (initialFileName) {
      setUploadedFileName(initialFileName)
    }
  }, [initialFileName])

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

  // Handle file upload - commented out but kept for future reference
  /* 
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // Store the uploaded document name in localStorage for future exercises
      localStorage.setItem('uploadedDocumentName', file.name);
      // Move to next step after file is uploaded
      setStep(2);
    }
  };
  */

  // Update the handleScenarioSelect function to reset responses
  const handleScenarioSelect = (question: {id: number, title: string, question: string}) => {
    setSelectedQuestion(question);
    setSelectedScenario(question.question);
    // Clear previous responses when selecting a new scenario
    setResponses({});
    setStep(3);
  };

  // Function to handle generating response for a single technique
  const handleGenerateResponse = async (techniqueId: string) => {
    if (!selectedScenario) return;
    
    setIsGenerating(true);
    setGeneratingTechnique(techniqueId);
    
    try {
      const technique = PROMPT_TECHNIQUES.find(t => t.id === techniqueId);
      if (!technique) return;
      
      const endpoint = modelToEndpointMapping[selectedModel];
      
      const response = await fetch(`/api/generate/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: technique.prompt(selectedScenario), 
          model: selectedModel,
          systemMessage: "You are an evaluator analyzing mobile device policies. Give a clear Yes or No answer with brief reasoning.",
          filePath: uploadedFileName || "Mobile-Device-Policy.pdf" 
        }),
      });
      
      const data = await response.json();
      
      setResponses(prev => ({
        ...prev,
        [techniqueId]: data.text || "No response received"
      }));
      
    } catch (error) {
      console.error(`Error generating response for ${techniqueId}:`, error);
      alert(`Error generating response for ${techniqueId}. Please try again.`);
    } finally {
      setIsGenerating(false);
      setGeneratingTechnique(null);
    }
  };
  
  // Fix the handleCompare function to properly show loading indicators for both techniques simultaneously
  const handleCompare = async () => {
    if (!selectedScenario) return;
    
    setIsGenerating(true);
    // Set both techniques as generating simultaneously
    setGeneratingTechnique('both');
    
    try {
      // Generate responses for both selected techniques simultaneously
      const techniques = [leftTechnique, rightTechnique];
      
      // Create an array of promises for both API calls
      const responsePromises = techniques.map(techniqueId => {
        const technique = PROMPT_TECHNIQUES.find(t => t.id === techniqueId);
        if (!technique) return Promise.resolve(null);
        
        const endpoint = modelToEndpointMapping[selectedModel];
        
        return fetch(`/api/generate/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: technique.prompt(selectedScenario), 
            model: selectedModel,
            systemMessage: "You are an evaluator analyzing mobile device policies. Give a clear Yes or No answer with brief reasoning.",
            filePath: uploadedFileName || "Mobile-Device-Policy.pdf" 
          }),
        })
        .then(response => response.json())
        .then(data => ({ techniqueId, text: data.text || "No response received" }));
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
    // Keep Upload Document step but mark it as completed
    // { number: 1, label: "Upload Document", isActive: false, isCompleted: true },
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

  // Helper function to render a technique card
  // Update the renderTechniqueCard function to handle the 'both' loading state
  const renderTechniqueCard = (techniqueId: string) => {
    const technique = PROMPT_TECHNIQUES.find(t => t.id === techniqueId);
    if (!technique) return null;
    
    // Show loading when generatingTechnique is 'both' or the specific techniqueId
    const isLoading = isGenerating && (generatingTechnique === 'both' || generatingTechnique === techniqueId);
    const hasResponse = responses[techniqueId] !== undefined;
    
    return (
      <div className="bg-gray-900/60 rounded-lg border border-gray-800/50 overflow-hidden h-full flex flex-col">
        <div className="bg-gray-800/80 p-3 flex justify-between items-center">
          <h3 className="text-white font-medium">{technique.title}</h3>
          <div className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded font-mono">
            PROMPT
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-800/30">
          <div className="bg-black/30 p-4 rounded text-sm font-mono text-gray-300 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {technique.prompt(selectedScenario || '')}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800/80 p-3 flex justify-between items-center">
            <h3 className="text-white font-medium">Response</h3>
            <div className="flex items-center gap-2">
              {hasResponse && (
                <span className="text-xs text-gray-400">
                  {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name.split(' ')[0]}
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
      /* Upload Document step is commented out but kept for future reference
      case 1:
        return (
          <div className="flex flex-col items-center justify-center max-w-xl mx-auto p-8 bg-gray-900/60 rounded-lg border border-gray-800/50 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Upload Document</h2>
            <p className="text-gray-300 mb-8 text-center">Upload a policy document to use as context for prompt engineering techniques</p>
            
            <div className="w-full max-w-md">
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500/50 transition-all duration-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-300">Click to select a file or drag and drop</p>
                <p className="text-gray-500 text-xs mt-2">PDF, TXT, DOCX (Max 10MB)</p>
                
                {uploadedFileName && (
                  <div className="mt-4 p-2 bg-indigo-900/30 rounded text-indigo-300 flex justify-between items-center">
                    <span>{uploadedFileName}</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden"
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="flex justify-end mt-8">
                <Button
                  disabled={!uploadedFileName}
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      */
        
      case 2: // Choose Scenario
        return (
          <div className="flex flex-col max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Choose a Scenario</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedQuestion?.id === question.id
                      ? 'bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50'
                      : 'bg-gray-900/80 border border-gray-800/50 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  }`}
                  onClick={() => handleScenarioSelect(question)}
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {question.id} : {question.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{question.question}</p>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScenarioSelect(question);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Select Scenario
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 3: // Compare Techniques with new dropdown selection
        return (
          <div className="flex flex-col max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <p className="text-gray-400 mb-2">
                Analyzing: {selectedQuestion?.title} 
              </p>
              <p className="text-gray-300 mb-6">{selectedQuestion?.question}</p>
              
              {/* Configuration panel for selecting techniques and model */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-medium text-white mb-4">Configure Comparison</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* First Technique Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      First Technique
                    </label>
                    <Select
                      value={leftTechnique}
                      onValueChange={(value) => {
                        if (value !== rightTechnique) {
                          setLeftTechnique(value);
                          // Clear the response for the changed technique
                          setResponses(prev => {
                            const updated = { ...prev };
                            delete updated[value];
                            return updated;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select technique" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {PROMPT_TECHNIQUES.map((technique) => (
                          <SelectItem 
                            key={technique.id} 
                            value={technique.id}
                            disabled={technique.id === rightTechnique}
                          >
                            {technique.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Second Technique Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Second Technique
                    </label>
                    <Select
                      value={rightTechnique}
                      onValueChange={(value) => {
                        if (value !== leftTechnique) {
                          setRightTechnique(value);
                          // Clear the response for the changed technique
                          setResponses(prev => {
                            const updated = { ...prev };
                            delete updated[value];
                            return updated;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select technique" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {PROMPT_TECHNIQUES.map((technique) => (
                          <SelectItem 
                            key={technique.id} 
                            value={technique.id}
                            disabled={technique.id === leftTechnique}
                          >
                            {technique.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Model Selection Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      AI Model
                    </label>
                    <Select
                      value={selectedModel}
                      onValueChange={(newModel) => {
                        setSelectedModel(newModel);
                        // Clear all responses when model changes
                        setResponses({});
                      }}
                    >
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleCompare}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Generating with {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name.split(' ')[0] || 'AI'}...
                      </div>
                    ) : (
                      "Compare Techniques"
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Technique comparison results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Technique Card */}
                {renderTechniqueCard(leftTechnique)}
                
                {/* Right Technique Card */}
                {renderTechniqueCard(rightTechnique)}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      <MainNavbar 
        backUrl={step === 2 ? '/week1' : undefined}
        backLabel={getBackLabel()}
        onBack={handleBackNavigation}
        rightContent={showCompleteButton ? (
          <Button 
            onClick={() => {
              markExerciseComplete("exercise2");
              router.push('/week1'); 
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Complete Exercise
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : undefined}
      />

      {/* Exercise title and nav steps */}
      <div className="container mx-auto px-4 py-3 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          {/* Exercise title on the left */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-200">
              Exercise 2: Prompt Engineering
            </h1>
            <p className="text-indigo-300 text-sm mt-1">
              Compare different prompting techniques
            </p>
          </div>
          
          {/* Nav steps on the right */}
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
                      ${index < step - 1 ? 'bg-green-600' : 'bg-gray-700'}`}
                  ></div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <main className="container mx-auto py-8">
          {renderStepContent()}
        </main>
      </div>

      <footer className="border-t border-gray-800/50 py-6 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}