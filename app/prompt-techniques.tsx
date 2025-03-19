"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { questions } from "@/components/prompt-question"
import PromptTechniquePanel from "@/components/PromptTechniquePanel"

interface Message {
  role: 'user' | 'assistant'
  content: string
  panelId?: 'A' | 'B' | 'C' | 'D'
}

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

export default function PromptTechniques() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [responses, setResponses] = useState<{ [key: string]: string | null }>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleScenarioSelect = async (scenario: string) => {
    setSelectedScenario(scenario)
    setIsGenerating(true)

    try {
      const fetchPromises = PROMPT_TECHNIQUES.map(technique =>
        fetch(`/api/generate/openai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: technique.prompt(scenario), model: 'gpt-4o', systemMessage:"You are evaluator give a Yes or No answer" }),
        })
      )

      const results = await Promise.all(fetchPromises)
      const data = await Promise.all(results.map(res => res.json()))

      const newResponses: { [key: string]: string | null } = {}
      PROMPT_TECHNIQUES.forEach((technique, index) => {
        newResponses[technique.id] = data[index].text
      })

      setResponses(newResponses)
    } catch (error) {
      console.error("Error generating responses:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-[#0D0D0D]">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col p-4 overflow-auto">
          {!selectedScenario ? (
            <>
              <div className="questions mb-4">
                <div className="text-sm text-gray-400 mb-2">Select a scenario for comparing different prompt techniques.</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {questions.map((question) => (
                    <div
                      key={question.id}
                      className="bg-[#1A1A1A] p-4 rounded-lg shadow-lg hover:bg-[#333333] cursor-pointer transition-colors"
                      onClick={() => handleScenarioSelect(question.question)}
                    >
                      <div className="text-white font-semibold mb-2">{question.title}</div>
                      <div className="text-gray-300">{question.question}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-auto">
              {PROMPT_TECHNIQUES.map(technique => (
                <PromptTechniquePanel
                  key={technique.id}
                  techniqueId={technique.id}
                  techniqueTitle={technique.title}
                  prompt={technique.prompt(selectedScenario)}
                  response={responses[technique.id]}
                  isGenerating={isGenerating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}