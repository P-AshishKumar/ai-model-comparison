"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, CheckCircle, Upload } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import aiCcoreLogo from '@/components/ailogo.svg'
import { Progress } from "@/components/ui/progress"

export default function DocumentUploadPage() {
  const router = useRouter()
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Check if a document is already uploaded
  useEffect(() => {
    const storedFileName = localStorage.getItem('uploadedDocumentName')
    if (storedFileName) {
      setUploadedFileName(storedFileName)
    }
    
    // Reset progress if coming back to this page
    setUploadProgress(0)
  }, [])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload progress
      setUploading(true)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploading(false)
            return 100
          }
          return prev + 5
        })
      }, 100)
      
      // After "upload" completes, set the file name
      setTimeout(() => {
        setUploadedFileName(file.name)
        localStorage.setItem('uploadedDocumentName', file.name)
        clearInterval(interval)
        setUploading(false)
        setUploadProgress(100)
      }, 2000)
    }
  }

  // Navigate to Single Panel View
  const handleNextClick = () => {
    router.push('/playground'); // Go directly to single-panel-view
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
      {/* Header - Matched with single-panel-view.tsx */}
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex items-center px-4">
          <div className="w-24">
            <Button variant="ghost" size="sm" onClick={() => router.push('/week1')} className="text-gray-400 hover:text-white">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center text-white font-semibold text-lg">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-gray-400">AI-CCORE</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-white">Exercise 1 </span>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center text-indigo-400">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-500 text-white">
                1
              </div>
              <span>Upload Document</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-gray-500">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-gray-800 text-gray-500">
                2
              </div>
              <span>Select Scenario</span>
            </div>
            
            <div className="text-gray-600 mx-2">→</div>
            
            <div className="flex items-center text-gray-500">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 bg-gray-800 text-gray-500">
                3
              </div>
              <span>Compare Models</span>
            </div>
          </div>
          
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-8">
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto p-8 bg-gray-900/60 rounded-lg border border-gray-800/50 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Document</h2>
          <p className="text-gray-300 mb-8 text-center">Upload a policy document to use as context for AI model comparison</p>
          
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
              
              {uploading && (
                <div className="mt-4">
                  <p className="text-gray-400 mb-2">Uploading...</p>
                  <Progress value={uploadProgress} className="h-2" />
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
                disabled={!uploadedFileName}
                onClick={handleNextClick}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
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