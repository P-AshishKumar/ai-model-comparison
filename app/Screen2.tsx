"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar" // Import MainNavbar

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
            switch (exerciseId) {
                case "exercise1":
                    router.push('/playground');
                    break;
                case "exercise2":
                    router.push('/playground2'); // Create this route for Exercise 2
                    break;
                case "exercise3":
                    router.push('/playground3'); // Create this route for Exercise 3
                    break;
                case "exercise4":
                    router.push('/playground4'); // Create this route for Exercise 4
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

    async function handleLogout() {
        try {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
    
          if (response.ok) {
            router.push("/login")
          }
        } catch (error) {
          console.error("Logout error:", error)
        }
      }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
            {/* Replace the header with MainNavbar */}
            <MainNavbar 
                backUrl="/"
                backLabel="Back"
                onBack={() => router.push('dashboard')}
                rightContent={
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                            size="sm"
                        >
                            Logout
                        </Button>
                        {/* <span className="text-sm text-gray-400">AI-CCORE</span> */}
                    </div>
                }
            />

            {/* Main content */}
            <main className="flex-grow container mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Week 1 <span className="text-indigo-400">Exercises</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Complete the following exercises to learn about AI model comparison
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
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className={`text-2xl ${isExerciseActive("exercise1") ? "text-white" : "text-gray-200"}`}>
                                    Exercise 1
                                </CardTitle>
                                {completedExercises.includes("exercise1") && (
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Completed
                                    </span>
                                )}
                            </div>
                            <CardDescription className={isExerciseActive("exercise1") ? "text-indigo-200" : "text-gray-400"}>
                                Model Comparison Lab
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={isExerciseActive("exercise1") ? "text-gray-200" : "text-gray-300"}>
                            <p>Compare responses from leading LLMs on the same prompts to analyze performance differences.</p>
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
                                    ? (completedExercises.includes("exercise1") ? "Redo Exercise" : "Start Exercise")
                                    : "Locked"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Exercise 2 Card */}
                    <Card className={`${completedExercises.includes('exercise1')
                        ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        : "bg-gray-900/80 border border-gray-800/50"} transition-all duration-300 hover:scale-105 backdrop-blur-sm relative`}
                    >
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
                            <CardDescription className="text-gray-400">Prompt Techniques</CardDescription>
                        </CardHeader>
                        <CardContent className="text-gray-300">
                            <p>Experiment with different prompt engineering techniques to see how they affect LLM responses to the same queries.</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleExercise2Click}
                                disabled={!completedExercises.includes('exercise1')}
                                className={completedExercises.includes('exercise1')
                                    ? "w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "w-full bg-gray-800 text-gray-400 cursor-not-allowed"}
                            >
                                {completedExercises.includes('exercise2') 
                                    ? "Redo Exercise" 
                                    : completedExercises.includes('exercise1') 
                                        ? "Start Exercise" 
                                        : "Complete Exercise 1 First"
                                }
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Exercise 3 Card */}
                    <Card className={`${isExerciseActive("exercise3")
                        ? "bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        : "bg-gray-900/80 border-gray-800/50"} 
                        border transition-all duration-300 hover:scale-105 backdrop-blur-sm relative`}
                    >
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className={`text-2xl ${isExerciseActive("exercise3") ? "text-white" : "text-gray-200"}`}>
                                    Exercise 3
                                </CardTitle>
                                {completedExercises.includes("exercise3") && (
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Completed
                                    </span>
                                )}
                            </div>
                            <CardDescription className={isExerciseActive("exercise3") ? "text-indigo-200" : "text-gray-400"}>
                                Design Prompts
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={isExerciseActive("exercise3") ? "text-gray-200" : "text-gray-300"}>
                            <p>Design a prompt for a specific use case using various prompting techniques and analyze their impact on the generated outputs.</p>
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
                                    ? (completedExercises.includes("exercise3") ? "Redo Exercise" : "Start Exercise")
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
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className={`text-2xl ${isExerciseActive("exercise4") ? "text-white" : "text-gray-200"}`}>
                                    Exercise 4
                                </CardTitle>
                                {completedExercises.includes("exercise4") && (
                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Completed
                                    </span>
                                )}
                            </div>
                            <CardDescription className={isExerciseActive("exercise4") ? "text-indigo-200" : "text-gray-400"}>
                               {/* Fast-Track Development */}
                               Copilot-Driven Development
                            </CardDescription>
                        </CardHeader>
                        <CardContent className={isExerciseActive("exercise4") ? "text-gray-200" : "text-gray-300"}>
                            <p>Use Copilot to build a notebook interface integrated with LLM in VS Code, streamlining development and significantly decreasing development time.</p>
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
                                    ? (completedExercises.includes("exercise4") ? "Redo Exercise" : "Start Exercise")
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