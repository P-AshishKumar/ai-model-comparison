"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Copy, X, Loader2, Star, CheckCircle, ArrowLeft, ArrowLeftRight, ArrowRight } from "lucide-react"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import aiCcoreLogo from '@/components/ailogo.svg'

interface ModelPanelProps {
  response: string | null
  isGenerating: boolean
  prompt: string
  showResponseArea: boolean
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  className?: string
  selectedModel: string
  isLastPanel?: boolean
  onCompleteExercise?: () => void
  onBackToScenario?: () => void
}

const ModelPanel: React.FC<ModelPanelProps> = ({ 
  response, 
  isGenerating, 
  prompt, 
  showResponseArea, 
  messages, 
  className, 
  selectedModel,
  isLastPanel = false,
  onCompleteExercise,
  onBackToScenario
}) => {
  const router = useRouter();
  const [ratings, setRatings] = useState({
    accuracy: 0,
    reasoning: 0,
    completeness: 0,
    clarity: 0,
    responseTime: 0
  });

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };
  
  const RatingStars = ({ category, label }: { category: keyof typeof ratings, label: string }) => {
    return (
      <div className="flex flex-col mb-2">
        <div className="text-xs text-gray-400 mb-1">{label}</div>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(category, star)}
              className={`p-0.5 focus:outline-none transition-colors`}
            >
              <Star 
                className={`h-4 w-4 ${ratings[category] >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-full flex flex-col border-r border-gray-800/50 bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950 ${className}`}>
      {/* Model name display */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="flex-1 flex justify-center items-center space-x-2">
          <div className="text-sm text-white">{selectedModel}</div>
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 p-4 overflow-auto bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950">
        {prompt && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">User Prompt</div>
              <div className="text-sm text-white">{prompt}</div>
            </div>

            {showResponseArea && (
              <div className="space-y-1">
                <div className="text-sm text-gray-400">Assistant Response:</div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : response ? (
                  <>
                    <div className="text-sm text-white whitespace-pre-wrap mb-4">{response}</div>
                    
                    {/* Rating section */}
                    {response && !isGenerating && (
                      <div className="mt-6 pt-4 border-t border-gray-800/50">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Rate this response:</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <RatingStars category="accuracy" label="Accuracy" />
                          <RatingStars category="reasoning" label="Reasoning Quality" />
                          <RatingStars category="completeness" label="Completeness" />
                          <RatingStars category="clarity" label="Clarity" />
                          <RatingStars category="responseTime" label="Response Time" />
                        </div>

                        <div className="mt-4 flex justify-between">
                          <Button 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                          >
                            Submit Feedback
                          </Button>
                          
                          {/* Add Complete Exercise button if this is the last panel and onCompleteExercise is provided */}
                          {isLastPanel && onCompleteExercise && (
                            <Button 
                              size="sm"
                              onClick={onCompleteExercise}
                              className="bg-blue-900 hover:bg-blue-800 text-white text-xs flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Complete Exercise
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Create a wrapper component that adds the global header
interface ModelPanelWithHeaderProps {
  children: React.ReactNode;
}

// Update the Back button to navigate to the single-panel view

const ModelPanelHeader: React.FC<ModelPanelWithHeaderProps> = ({ children }) => {
  const router = useRouter();
  
  const handleComplete = () => {
    // Mark exercise as complete and navigate to exercises page
    const storedCompletedExercises = localStorage.getItem('completedExercises') || '[]';
    const completedExercises = JSON.parse(storedCompletedExercises);
    
    if (!completedExercises.includes('exercise1')) {
      completedExercises.push('exercise1');
      localStorage.setItem('completedExercises', JSON.stringify(completedExercises));
    }
    
    // Navigate to Screen1 (home page)
    router.push('/'); // This will render Screen1 component since it's the default route
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex flex-col">
          <div className="flex items-center px-4 justify-between">
            {/* Left side - Back button - Updated to go to /playground */}
            <div className="w-24">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/playground')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
            </div>
            
            {/* Center - Title */}
            <div className="flex-1 flex items-center justify-center text-white font-semibold text-lg">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <span className="text-gray-400">AI-CCORE</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="text-white">Exercise 1</span>
            </div>
            
            {/* Right side - Next button */}
            <div className="w-24 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/playground2')}
                className="text-gray-400 hover:text-white"
              >
                Next
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2 justify-center mt-2">
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-900/50 text-indigo-300">
                1
              </div>
              <span>Upload Document</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-900/50 text-indigo-300">
                2
              </div>
              <span>Select Scenario</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-500 text-white">
                3
              </div>
              <span>Compare Models</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col">
        {children}
        
        {/* Complete Exercise button at bottom right */}
        <div className="sticky bottom-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm flex justify-end">
          <Button 
            onClick={handleComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md flex items-center gap-2"
          >
            Complete Exercise
            <CheckCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ModelPanel, ModelPanelHeader };
