"use client"

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import aiCcoreLogo from '@/components/ailogo.svg';

interface NavbarProps {
  title?: string;
  subtitle?: string;
  backUrl?: string;
  backLabel?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  steps?: Array<{
    number: number;
    label: string;
    isActive: boolean;
    isCompleted: boolean;
  }>;
  logoHref?: string;
}

const Navbar = ({
  title,
  subtitle,
  backUrl,
  backLabel = "Back",
  onBack,
  rightContent,
  steps,
  logoHref = "/",
}: NavbarProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backUrl) {
      router.push(backUrl);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-black/30 backdrop-blur-sm">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(backUrl || onBack) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="h-8 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {backLabel}
            </Button>
          )}
          
          <Link href={logoHref} className="flex items-center gap-2">
            <Image src={aiCcoreLogo} alt="AI-CCORE Logo" width={28} height={28} />
            {(title || subtitle) && (
              <div>
                {title && <h1 className="text-sm font-medium text-white">{title}</h1>}
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
              </div>
            )}
          </Link>
        </div>
        
        {rightContent && (
          <div className="flex items-center">
            {rightContent}
          </div>
        )}
      </div>
      
      {/* Optional steps indicator */}
      {steps && steps.length > 0 && (
        <div className="flex justify-center py-3 bg-gray-900/50 border-b border-gray-800">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                      ${step.isActive
                        ? 'bg-indigo-600 text-white'
                        : step.isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                  >
                    {step.isCompleted && !step.isActive ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`text-xs ${step.isActive ? 'text-indigo-300 font-medium' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>

                {/* Connector line between steps */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 
                      ${steps.findIndex(s => s.isActive) > index ||
                        (index < steps.length - 1 && steps[index].isCompleted && steps[index + 1].isCompleted)
                        ? 'bg-green-600' : 'bg-gray-700'}`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

