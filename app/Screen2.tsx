"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

// Define props interface
interface Screen2Props {
  initialCompletedExercises?: string[]
  currentExercise?: string
}

const Screen2 = ({ 
  initialCompletedExercises = [], 
  currentExercise = "exercise1" 
}: Screen2Props) => {
  const router = useRouter();
  
  const [completedExercises, setCompletedExercises] = useState<string[]>(initialCompletedExercises);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedExercises = localStorage.getItem('completedExercises');
      if (storedExercises) {
        setCompletedExercises(JSON.parse(storedExercises));
      }
    }
  }, []);

  const handleExerciseClick = (exerciseId: string) => {
    if (exerciseId === currentExercise || completedExercises.includes(exerciseId)) {
      // Navigate to the appropriate route for each exercise
      switch(exerciseId) {
        case "exercise1":
          // Always go to document upload first for Exercise 1
          router.push('/document-upload');
          break;
        case "exercise2":
          // For exercise 2
          const exercise2FileName = localStorage.getItem('uploadedDocumentName');
          if (!exercise2FileName && completedExercises.includes("exercise1")) {
            router.push('/playground2');
          } else {
            router.push('/playground2');
          }
          break;
        case "exercise3":
          router.push('/playground3');
          break;
        case "exercise4":
          router.push('/playground4');
          break;
      }
    }
  };

  // Function to determine if an exercise is accessible
  const isExerciseActive = (exerciseId: string) => {
    return exerciseId === currentExercise || completedExercises.includes(exerciseId);
  };

  const handleExercise2Click = () => {
    router.push('/playground2');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      {/* Header */}
      <header className="border-b border-gray-800/50 py-4 backdrop-blur-sm bg-black/20 sticky top-0 z-10">
        <div className="container mx-auto flex items-center px-4">
          <div className="w-24">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-400 hover:text-white">
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
            <span className="text-white">Week 1 LLM Model Prompt and More</span>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Week 1 <span className="text-indigo-400">Exercises</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          </p>
        </div>

        {/* Exercise grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Exercise 1 Card */}
          <Card className={`${isExerciseActive("exercise1") 
            ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
            : "bg-gray-900/80 border-gray-800/50"} 
            border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative`}
          >
            {completedExercises.includes("exercise1") && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-0.5">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <CardHeader>
              <CardTitle className={`text-2xl ${isExerciseActive("exercise1") ? "text-white" : "text-gray-200"}`}>
                Exercise 1
              </CardTitle>
              <CardDescription className={isExerciseActive("exercise1") ? "text-indigo-200" : "text-gray-400"}>
                Model Comparison Lab
              </CardDescription>
            </CardHeader>
            <CardContent className={isExerciseActive("exercise1") ? "text-gray-200" : "text-gray-300"}>
              <p>Compare responses from different LLM models for same scenerio to understand performance differences.</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleExerciseClick("exercise1")} 
                disabled={!isExerciseActive("exercise1")}
                className={`w-full ${isExerciseActive("exercise1") 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-gray-800 text-gray-400 cursor-not-allowed"}`}
              >
                {isExerciseActive("exercise1") 
                  ? (completedExercises.includes("exercise1") ? "Continue Exercise" : "Start Exercise") 
                  : "Locked"} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

         {/* Exercise 2 Card */}
<Card className={`${completedExercises.includes('exercise1') 
  ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
  : "bg-gray-900/80 border border-gray-800/50"} transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
  <CardHeader>
    <div className="flex justify-between items-center">
      <CardTitle className="text-2xl text-gray-200">Exercise 2</CardTitle>
      {completedExercises.includes('exercise2') && (
        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      )}
    </div>
    <CardDescription className="text-gray-400">Prompt Engineering</CardDescription>
  </CardHeader>
  <CardContent className="text-gray-300">
    <p>Using prompt techniques to check how they influence the response for same scenario but different prompt techniques.</p>
  </CardContent>
  <CardFooter>
    <Button 
      onClick={handleExercise2Click}
      disabled={!completedExercises.includes('exercise1')}
      className={completedExercises.includes('exercise1') 
        ? "w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        : "w-full bg-gray-800 text-gray-400 cursor-not-allowed"}
    >
      {completedExercises.includes('exercise1') ? (
        <>Start Exercise <ArrowRight className="ml-2 h-4 w-4" /></>
      ) : (
        <>Complete Exercise 1 First <ArrowRight className="ml-2 h-4 w-4" /></>
      )}
    </Button>
  </CardFooter>
</Card>

          {/* Exercise 3 Card */}
          <Card className={`${isExerciseActive("exercise3") 
            ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
            : "bg-gray-900/80 border-gray-800/50"} 
            border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative`}
          >
            {completedExercises.includes("exercise3") && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-0.5">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <CardHeader>
              <CardTitle className={`text-2xl ${isExerciseActive("exercise3") ? "text-white" : "text-gray-200"}`}>
                Exercise 3
              </CardTitle>
              <CardDescription className={isExerciseActive("exercise3") ? "text-indigo-200" : "text-gray-400"}>
                Create Prompts
              </CardDescription>
            </CardHeader>
            <CardContent className={isExerciseActive("exercise3") ? "text-gray-200" : "text-gray-300"}>
              <p>Creating scenario-specific prompts to understand LLM models performance </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleExerciseClick("exercise3")} 
                disabled={!isExerciseActive("exercise3")}
                className={`w-full ${isExerciseActive("exercise3") 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-gray-800 text-gray-400 cursor-not-allowed"}`}
              >
                {isExerciseActive("exercise3") 
                  ? (completedExercises.includes("exercise3") ? "Review Exercise" : "Start Exercise") 
                  : "Locked"} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Exercise 4 Card */}
          <Card className={`${isExerciseActive("exercise4") 
            ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]" 
            : "bg-gray-900/80 border-gray-800/50"} 
            border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative`}
          >
            {completedExercises.includes("exercise4") && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-0.5">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <CardHeader>
              <CardTitle className={`text-2xl ${isExerciseActive("exercise4") ? "text-white" : "text-gray-200"}`}>
                Exercise 4
              </CardTitle>
              <CardDescription className={isExerciseActive("exercise4") ? "text-indigo-200" : "text-gray-400"}>
                Results Interpretation
              </CardDescription>
            </CardHeader>
            <CardContent className={isExerciseActive("exercise4") ? "text-gray-200" : "text-gray-300"}>
              <p>pending description about exercise 4</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleExerciseClick("exercise4")} 
                disabled={!isExerciseActive("exercise4")}
                className={`w-full ${isExerciseActive("exercise4") 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                  : "bg-gray-800 text-gray-400 cursor-not-allowed"}`}
              >
                {isExerciseActive("exercise4") 
                  ? (completedExercises.includes("exercise4") ? "Review Exercise" : "Start Exercise") 
                  : "Locked"} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Screen2;