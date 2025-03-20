"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eraser } from "lucide-react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import aiCcoreLogo from '@/components/ailogo.svg'

interface NavbarProps {
  // Title information
  title: string
  subtitle?: string
  
  // Navigation
  backUrl?: string
  backLabel?: string
  onBack?: () => void
  
  // Optional actions
  onClear?: () => void
  rightContent?: React.ReactNode
  
  // Optional progress indicators
  steps?: {
    number: number
    label: string
    isActive: boolean
    isCompleted: boolean
  }[]
  currentStep?: number
}

export default function MainNavbar({ 
  title, 
  subtitle, 
  backUrl = '/',
  backLabel = 'Back',
  onBack,
  onClear, 
  rightContent,
  steps,
  currentStep
}: NavbarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      router.push(backUrl);
    }
  }

  return (
    <header className="flex flex-col border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="w-24">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack} 
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {backLabel}
          </Button>
        </div>

        <div className="flex items-center text-white font-semibold text-lg">
          <Image
            src={aiCcoreLogo}
            alt="AI-CCORE Logo"
            width={120}
            height={115}
            className="mr-3"
          />
          {subtitle && (
            <>
              <span className="text-gray-400">{subtitle}</span>
              <span className="mx-2 text-gray-600">|</span>
            </>
          )}
          <span>{title}</span>
        </div>

        <div className="w-24 flex justify-end">
          {onClear && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={onClear}
            >
              <Eraser className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
          {rightContent}
        </div>
      </div>

      {/* Progress Steps */}
      {steps && steps.length > 0 && (
        <div className="container mx-auto px-4 mt-4">
          <div className="hidden md:flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {index > 0 && <div className="text-gray-600 mx-2">→</div>}
                <div className={`flex items-center ${
                  step.isActive || step.isCompleted ? 'text-indigo-400' : 'text-gray-500'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    step.isActive ? 'bg-indigo-500 text-white' :
                    step.isCompleted ? 'bg-indigo-900/50 text-indigo-300' : 
                    'bg-gray-800 text-gray-500'
                  }`}>
                    {step.number}
                  </div>
                  <span>{step.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}