"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Upload } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import aiCcoreLogo from '@/components/ailogo.svg'
import { questions } from "@/components/prompt-question"
import PromptTechniquePanel from "@/components/PromptTechniquePanel"

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

// Add this interface at the top
interface Exercise2PageProps {
  initialFileName?: string | null
}

export default function Exercise2Page({ initialFileName = null }: Exercise2PageProps) {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Upload, 2: Choose Scenario, 3: Choose Prompts
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<{id: number, title: string, question: string} | null>(null)
  const [responses, setResponses] = useState<{ [key: string]: string | null }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(initialFileName)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Load the file and move to step 2 if a file is already provided
  useEffect(() => {
    if (initialFileName) {
      setUploadedFileName(initialFileName)
      setStep(2) // Skip to scenario selection
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

  // Handle file upload
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

  // Handle scenario selection
  const handleScenarioSelect = (question: {id: number, title: string, question: string}) => {
    setSelectedQuestion(question);
    setSelectedScenario(question.question);
    setStep(3);
  };

  // Handle generating responses for prompt techniques
  const handleGenerateResponses = async () => {
    if (!selectedScenario) return;
    setIsGenerating(true);

    try {
      // Generate all responses at once
      const fetchPromises = PROMPT_TECHNIQUES.map(technique =>
        fetch(`/api/generate/openai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: technique.prompt(selectedScenario), 
            model: 'gpt-4o',  // You can use the same model for consistency
            systemMessage: "You are an evaluator analyzing mobile device policies. Give a clear Yes or No answer with brief reasoning.",
            filePath: uploadedFileName || "Mobile-Device-Policy.pdf" 
          }),
        })
      );

      const results = await Promise.all(fetchPromises);
      const data = await Promise.all(results.map(res => res.json()));

      const newResponses: { [key: string]: string | null } = {};
      PROMPT_TECHNIQUES.forEach((technique, index) => {
        newResponses[technique.id] = data[index].text || "No response received";
      });

      setResponses(newResponses);
      console.log("Responses generated:", newResponses);
    } catch (error) {
      console.error("Error generating responses:", error);
      // Add user feedback for the error
      alert("Error generating responses. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (step) {
      case 1: // Upload Document
        return (
          <div className="flex flex-col items-center justify-center max-w-xl mx-auto p-8 bg-gray-900/60 rounded-lg border border-gray-800/50 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Step 1: Upload Document</h2>
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
              
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => router.push('/week1')}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Exercises
                </Button>
                
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
        
      case 2: // Choose Scenario
        return (
          <div className="flex flex-col max-w-5xl mx-auto px-4">
            <div className="flex justify-between mb-8 items-center">
              <h2 className="text-2xl font-bold text-white">Step 2: Choose Scenario</h2>
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Upload
              </Button>
            </div>
            
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
                    Scenario {question.id}: {question.title}
                  </h3>
                  <p className="text-gray-300 mb-4">{question.question}</p>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleScenarioSelect(question)}
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
        
      case 3: // Choose Prompts and View Responses
        return (
          <div className="flex flex-col max-w-7xl mx-auto px-4">
            <div className="flex justify-between mb-6 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Step 3: Compare Prompt Techniques</h2>
                <p className="text-gray-400">
                  Scenario: {selectedQuestion?.title} 
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Scenarios
                </Button>
                
                {Object.keys(responses).length === 0 && (
                  <Button
                    onClick={handleGenerateResponses}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>Generate Responses</>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Prompt Techniques Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {PROMPT_TECHNIQUES.map(technique => (
                <div 
                  key={technique.id}
                  className="bg-gray-900/60 rounded-lg border border-gray-800/50 overflow-hidden"
                >
                  <div className="bg-gray-800/80 p-3 flex justify-between items-center">
                    <h3 className="text-white font-medium">{technique.title}</h3>
                    <div className="bg-green-900/40 text-green-400 text-xs px-2 py-1 rounded font-mono">
                      PROMPT
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-gray-800/30">
                    <div className="bg-black/30 p-3 rounded text-sm font-mono text-gray-300 max-h-40 overflow-y-auto">
                      {technique.prompt(selectedScenario || '')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-gray-800/80 p-3 flex justify-between items-center">
                      <h3 className="text-white font-medium">Response</h3>
                      <div className="bg-blue-900/40 text-blue-400 text-xs px-2 py-1 rounded font-mono">
                        RESPONSE
                      </div>
                    </div>
                    
                    <div className="p-4 min-h-[120px]">
                      {isGenerating ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : responses[technique.id] ? (
                        <div className="text-white whitespace-pre-wrap">{responses[technique.id]}</div>
                      ) : (
                        <div className="text-gray-400 italic text-center py-10">
                          Response will appear here after generation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Complete Exercise & Next Exercise Buttons */}
            {Object.keys(responses).length > 0 && (
              <div className="flex justify-between mt-8 mb-4">
                <Button 
                  onClick={() => {
                    markExerciseComplete("exercise2");
                    router.push('/week1'); 
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                >
                  Next Exercise
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="text-gray-400 hover:text-white flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Scenarios
                </Button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center text-white font-semibold text-lg">
            <Image
              src={aiCcoreLogo}
              alt="AI-CCORE Logo"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-gray-400">AI-CCORE</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-gray-400">Exercise 2:</span>
            <span className="ml-2">Prompt Engineering</span>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step === 1 ? 'bg-indigo-500 text-white' : 
                step > 1 ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-500'
              }`}>
                1
              </div>
              <span>Upload Document</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step === 2 ? 'bg-indigo-500 text-white' : 
                step > 2 ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-800 text-gray-500'
              }`}>
                2
              </div>
              <span>Choose Scenario</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className={`flex items-center ${step >= 3 ? 'text-indigo-400' : 'text-gray-500'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                step === 3 ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-500'
              }`}>
                3
              </div>
              <span>Compare Prompts</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/week1')} 
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            
            {step > 1 && (
              <Button 
                size="sm" 
                onClick={() => {
                  // Only enable the Next button when appropriate conditions are met
                  if ((step === 2 && selectedQuestion) || (step === 3 && Object.keys(responses).length > 0)) {
                    if (step === 3) {
                      // Mark exercise as complete and go to next exercise
                      markExerciseComplete("exercise2");
                      router.push('/week1');
                    } else {
                      // Move to the next step within this exercise
                      setStep(step + 1);
                    }
                  }
                }}
                disabled={(step === 2 && !selectedQuestion) || (step === 3 && Object.keys(responses).length === 0)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {step === 3 ? 'Complete Exercise' : 'Next Step'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-8">
        {renderStepContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}