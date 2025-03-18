"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Eraser, Brain, ArrowLeft } from "lucide-react"
import ChatInput from "@/components/chat-input"
import ModelPanel from "@/components/model-panel"
import SinglePanelView from "@/components/single-panel-view"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import aiCcoreLogo from '@/components/ailogo.svg'

interface Message {
    role: 'user' | 'assistant'
    content: string
    panelId?: 'A' | 'B' | 'C'
}

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

    // Existing functions preserved
    const handleSubmit = async (input: string) => {
        if (!input) return
        setPrompt(input)
        setIsGenerating(true)

        // Add user message to history
        const userMessage: Message = {
            role: 'user',
            content: input
        }
        setMessages(prev => [...prev, userMessage])

        try {
            // Generate responses based on how many panels are visible
            const panelsToGenerate = compareCount === COMPARE_SINGLE ? 1 : compareCount === COMPARE_DOUBLE ? 2 : 3

            // Define default models for each panel
            const defaultModels = {
                A: 'openai/gpt-4',
                B: 'anthropic/claude-3-sonnet',
                C: 'google/gemini-1.5-pro'
            }

            const fetchPromises = []
            for (let i = 0; i < panelsToGenerate; i++) {
                const panelId = String.fromCharCode(65 + i) as 'A' | 'B' | 'C'
                const model = defaultModels[panelId]
                const [provider] = model.split('/')

                fetchPromises.push(
                    fetch(`/api/generate/${provider}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: input, model }),
                    }),
                )
            }

            const results = await Promise.all(fetchPromises)
            const dataPromises = results.map((res) => res.json())
            const data = await Promise.all(dataPromises)

            // Update responses
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

    const handleQuestionSelect = async (question: { title: string, question: string, options: string[] }) => {
        setPrompt(question.question)
        setCompareCount(COMPARE_TRIPLE) // Switch to multiple view response

        try {
            setIsGenerating(true)

            const fetchPromises = ["A", "B", "C"].map(panelId =>
                fetch(`/api/generate/${panelId === "A" ? "openai" : panelId === "B" ? "anthropic" : "google"}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: question.question,
                        model: panelId === "A" ? "gpt-4" : panelId === "B" ? "claude-3-sonnet" : "gemini-1.5-pro",
                    }),
                })
            )

            const results = await Promise.all(fetchPromises)
            const data = await Promise.all(results.map(res => res.json()))

            setResponses({
                A: data[0].text,
                B: data[1].text,
                C: data[2].text,
            })
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

    const handleCompareClick = () => {
        setCompareCount((prev) => (prev >= COMPARE_TRIPLE ? COMPARE_SINGLE : prev + 1))
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
            {/* Header */}
            <header className="flex items-center justify-between px-4 h-14 border-b border-gray-800/50 backdrop-blur-sm bg-black/20 shrink-0">
                {/* Left side - Back button */}
                <div className="w-24">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Center logo and text */}
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

                {/* Right side buttons */}
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleCompareClick} className="text-gray-400 hover:text-white">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        {compareCount === COMPARE_SINGLE ? "Compare" : compareCount === COMPARE_DOUBLE ? "Compare (3)" : "Single View"}
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
                </div>
            </header>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black/10 backdrop-blur-sm">
                {compareCount === COMPARE_SINGLE ? (
                    <SinglePanelView
                        response={responses.A}
                        isGenerating={isGenerating}
                        prompt={prompt}
                        onSubmit={handleSubmit}
                        messages={messages}
                        onQuestionSelect={handleQuestionSelect}
                    />
                ) : (
                    <>
                        <div className={`grid ${compareCount === COMPARE_DOUBLE ? "grid-cols-2" : "grid-cols-3"} gap-0 h-[calc(100vh-180px)] overflow-hidden border-b border-gray-800/50`}>
                            <ModelPanel
                                panelId="A"
                                className="overflow-auto border-r border-gray-800/50"
                                response={responses.A}
                                isGenerating={isGenerating}
                                prompt={prompt}
                                showResponseArea={true}
                                messages={messages.filter(m => !m.panelId || m.panelId === 'A')}
                            />

                            <ModelPanel
                                panelId="B"
                                className={`overflow-auto ${compareCount === COMPARE_TRIPLE ? "border-r border-gray-800/50" : ""}`}
                                response={responses.B}
                                isGenerating={isGenerating}
                                prompt={prompt}
                                showResponseArea={true}
                                messages={messages.filter(m => !m.panelId || m.panelId === 'B')}
                            />

                            {compareCount >= COMPARE_TRIPLE && (
                                <ModelPanel
                                    panelId="C"
                                    className="overflow-auto"
                                    response={responses.C}
                                    isGenerating={isGenerating}
                                    prompt={prompt}
                                    showResponseArea={true}
                                    messages={messages.filter(m => !m.panelId || m.panelId === 'C')}
                                />
                            )}
                        </div>

                        {/* Chat input - only shown in compare mode */}
                        {compareCount > COMPARE_SINGLE && (
                            <div className="shrink-0 p-4 border-t border-gray-800/50 bg-black/20 backdrop-blur-sm">
                                <ChatInput onSubmit={handleSubmit} isGenerating={isGenerating} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}