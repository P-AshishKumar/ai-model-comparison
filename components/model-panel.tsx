"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save, Copy, Loader2, Star, RefreshCcw, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface ModelPanelProps {
  response: string | null
  isGenerating: boolean
  prompt: string
  showResponseArea: boolean
  messages: Array<{ role: 'user' | 'assistant', content: string }>
  className?: string
  selectedModel: string
  onRatingChange?: (modelId: string, ratings: Record<string, number>) => void
}

const ModelPanel: React.FC<ModelPanelProps> = ({ 
  response, 
  isGenerating, 
  prompt, 
  showResponseArea, 
  messages, 
  className, 
  selectedModel,
  onRatingChange
}) => {
  const [ratings, setRatings] = useState({
    accuracy: 0,
    reasoning: 0,
    completeness: 0,
    clarity: 0,
    responseTime: 0
  });
  const [displayedText, setDisplayedText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamIndex, setStreamIndex] = useState(0);
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutTimer, setTimeoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Handle streaming effect when response changes
  useEffect(() => {
    if (response && isGenerating) {
      setStreaming(true);
      setStreamIndex(0);
      setDisplayedText("");
    } else if (response) {
      setStreaming(false);
      setDisplayedText(response);
    }
  }, [response, isGenerating]);

  // Handle streaming text effect
  useEffect(() => {
    if (streaming && response && streamIndex < response.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + response[streamIndex]);
        setStreamIndex(streamIndex + 1);
      }, 15); // Adjust speed as needed
      
      return () => clearTimeout(timer);
    } else if (streaming && response && streamIndex >= response.length) {
      setStreaming(false);
    }
  }, [streaming, streamIndex, response]);

  // Handle timeout for long-running requests
  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        setShowTimeout(true);
      }, 15000); // 15 seconds timeout
      
      setTimeoutTimer(timer);
      return () => clearTimeout(timer);
    } else {
      if (timeoutTimer) clearTimeout(timeoutTimer);
      setShowTimeout(false);
    }
  }, [isGenerating]);

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    const updatedRatings = { ...ratings, [category]: value };
    setRatings(updatedRatings);
    
    // Notify parent component about rating change
    if (onRatingChange) {
      onRatingChange(selectedModel, updatedRatings);
    }
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      // You could add a toast notification here
    }
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
              aria-label={`Rate ${label} ${star} out of 5`}
            >
              <Star
                className={`h-4 w-4 ${ratings[category] >= star 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-600 hover:text-gray-400'}`}
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
      <div className="flex items-center justify-between px-3 py-2 sm:py-2.5 border-b border-gray-800/50 bg-black/30 backdrop-blur-sm">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-xs sm:text-sm font-medium text-indigo-300">{selectedModel}</div>
        </div>
        {response && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyToClipboard} title="Copy response">
            <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
          </Button>
        )}
      </div>

      {/* Panel content */}
      <div className="flex-1 p-3 sm:p-4 overflow-auto hide-scrollbar">
        {/* Messages */}
        {prompt && (
          <div className="space-y-4 max-w-full">
            <div className="space-y-2 bg-gray-800/20 rounded-lg p-3">
              <div className="text-xs sm:text-sm font-medium text-gray-400">User Prompt</div>
              <div className="text-xs sm:text-sm text-white">{prompt}</div>
            </div>

            {showResponseArea && (
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-medium text-gray-400">Assistant Response:</div>
                <div className="bg-gray-800/20 rounded-lg p-3 min-h-[100px]">
                  {isGenerating ? (
                    showTimeout ? (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <p className="text-sm text-amber-400 mb-3">This is taking longer than usual...</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <RefreshCcw className="h-3.5 w-3.5 mr-1.5" />
                          Try Again
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-6">
                        <div className="flex items-center gap-1.5">
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                          <span className="text-sm text-gray-400">Generating response...</span>
                        </div>
                      </div>
                    )
                  ) : response ? (
                    <>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={`${className} bg-gray-800 px-1 py-0.5 rounded text-xs`} {...props}>
                                  {children}
                                </code>
                              )
                            },
                            p: ({children}) => <p className="mb-4 text-sm text-gray-100">{children}</p>,
                            h1: ({children}) => <h1 className="text-xl font-bold mb-4 text-white">{children}</h1>,
                            h2: ({children}) => <h2 className="text-lg font-bold mb-3 text-white">{children}</h2>,
                            h3: ({children}) => <h3 className="text-md font-bold mb-2 text-white">{children}</h3>,
                            ul: ({children}) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                            li: ({children}) => <li className="text-sm text-gray-200">{children}</li>,
                            a: ({href, children}) => <a href={href} className="text-indigo-400 hover:underline" target="_blank">{children}</a>,
                          }}
                        >
                          {streaming ? displayedText + "▎" : displayedText}
                        </ReactMarkdown>
                      </div>

                      {/* Rating section */}
                      {response && !isGenerating && !streaming && (
                        <div className="mt-8 pt-4 border-t border-gray-800/30">
                          <h4 className="text-sm font-medium text-gray-300 mb-4">Rate this response:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-4">
                            <RatingStars category="accuracy" label="Accuracy" />
                            <RatingStars category="reasoning" label="Reasoning" />
                            <RatingStars category="completeness" label="Completeness" />
                            <RatingStars category="clarity" label="Clarity" />
                            <RatingStars category="responseTime" label="Speed" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelPanel