"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Save, Copy, X, Loader2, Star } from "lucide-react"

interface ModelPanelProps {
  response: string | null
  isGenerating: boolean
  prompt: string
  showResponseArea: boolean
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  className?: string
  selectedModel: string
}

const ModelPanel: React.FC<ModelPanelProps> = ({ response, isGenerating, prompt, showResponseArea, messages, className, selectedModel }) => {
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
      {/* Panel header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <div className="flex-1 flex justify-center items-center space-x-2">
          <div className="text-sm text-white">{selectedModel}</div>
        </div>
        <div className="flex items-center space-x-1">
          {/* <Button variant="ghost" size="icon" className="h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button> */}
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 p-4 overflow-auto bg-gradient-to-b from-gray-950 via-gray-900 to-blue-950">
        {/* Messages */}
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

                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                          >
                            Submit Feedback
                          </Button>
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

export default ModelPanel