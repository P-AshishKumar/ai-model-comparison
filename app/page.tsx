"use client"

import { ArrowRight, Brain, Code, Sparkles } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import aiCcoreLogo from '@/components/ailogo.svg'

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto flex justify-center items-center px-4">
          <div className="flex items-center text-white font-semibold text-lg">
            <Image
              src={aiCcoreLogo}
              alt="AI-CCORE Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-gray-400">AI-CCORE</span>
            <span className="mx-0.5 text-gray-600">|</span>
            <span>Platform</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Compare AI Models <span className="text-indigo-400">Side-by-Side</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Test and compare responses from leading AI models to find the right one for your needs
          </p>

          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.6)] hover:scale-105"
            onClick={() => router.push("/playground")}
          >
            Start Comparing Models
            <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-gray-900/70 border border-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 hover:border-indigo-500/50 group">
            <div className="bg-indigo-600/80 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">LLM Performance Comparison</h3>
            <p className="text-gray-300 mb-4">Compare multiple AI models side-by-side</p>

            <div className="bg-gray-800/60 p-4 rounded-md text-sm text-gray-300 leading-relaxed backdrop-blur-sm">
              <p className="mb-2"><span className="font-semibold text-indigo-400">Exercise 1:</span> LLM Performance Comparison</p>
              <p className="mb-2">This exercise challenges participants to evaluate leading language models through hands-on testing. Users will upload documents and apply standardized prompts to Claude, GPT, DeepSeek, and Gemini.</p>
              <p className="mb-2">After receiving responses, users rate each output based on accuracy,reasoning,completeness,clarity. Group discussion follows to compare these models and identify model strengths.</p>
              <p className="mb-2">The instructor will be provided analysis using benchmark performance data.</p>
              <p>Reset and navigation controls allow participants to repeat the exercise with different models.</p>

              {/* Download PDF link */}
              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <a
                  href="https://www.wpi.edu/sites/default/files/2019/05/03/Mobile-Device-Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Exercise PDF
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/70 border border-gray-800/50 p-6 rounded-lg backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 hover:border-indigo-500/50 group">
            <div className="bg-indigo-600/80 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto transition-transform group-hover:scale-110">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Prompt Engineering Techniques</h3>
            <p className="text-gray-300 mb-4">Test different prompting strategies</p>

            <div className="bg-gray-800/60 p-4 rounded-md text-sm text-gray-300 leading-relaxed backdrop-blur-sm">
              <p className="mb-2"><span className="font-semibold text-indigo-400">Exercise 2:</span> Prompting Strategy Comparison</p>
              <p className="mb-2">This exercise examines how different prompting approaches affect GPT's performance. Users begin by setting parameters and uploading documents to test consistent content across various techniques.</p>
              <p className="mb-2">The exercise compares zero-shot, role-based, few-shot, and chain-of-thought prompting strategies side-by-side, allowing users to observe differences in response structure, reasoning, and accuracy.</p>
              <p className="mb-2">Participants rate each strategy's effectiveness and discuss the results. When participant rankings differ from expected outcomes, the instructor provides analysis based on established benchmarks.</p>
              <p>In the second phase, participants develop prompts designed to match target responses, testing their understanding of effective prompt engineering. The exercise includes reset functionality and navigation to subsequent modules, with all prompts becoming available for independent practice.</p>

              {/* Download PDF link */}
              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <a
                  href="https://www.wpi.edu/sites/default/files/2019/05/03/Mobile-Device-Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Exercise PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 mt-20 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500">
          <p>© 2023 AI-CCORE Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}