"use client"

import { useState, useRef, useEffect, Fragment } from "react"
import { useRouter } from 'next/navigation'
import ScenarioSelection from "./components/ScenarioSelection"
import TasksList from "./components/TasksList"
import ChatInterface from "./components/ChatInterface"
import MainNavbar from "@/components/MainNavbar"
import { CheckCircle } from "lucide-react"
import { 
    scenarioData, 
    medicalClaimTasks, 
    loanApplicationTasks, 
    predictiveMaintenanceTasks,
    medicalClaimData,
    loanApplicationData,
    trainSensorData
} from "./components/data"

interface SavedPrompt {
    id: string
    taskId: string
    scenarioId: string
    text: string
    timestamp: number
}

interface Message {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    isPrompt?: boolean
    promptId?: string
}

export default function Home() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<"scenario" | "task-selection" | "chat">("scenario")
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
    const [selectedTask, setSelectedTask] = useState<string | null>(null)
    const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])
    const [messages, setMessages] = useState<Record<string, Message[]>>({})
    const [inputMessage, setInputMessage] = useState("")
    const [showSavedPrompts, setShowSavedPrompts] = useState(false)
    
    // Remove these individual state variables since we'll use the function directly
    // const [data, setData] = useState<any>(null)
    // const [dataName, setDataName] = useState<string>("claim")
    // const [tasks, setTasks] = useState<any[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Determine which tasks and data to use based on the selected scenario
    const getScenarioData = () => {
        switch (selectedScenario) {
            case "medical-claims":
                return {
                    tasks: medicalClaimTasks,
                    data: medicalClaimData,
                    dataName: "claim"
                }
            case "loan-application":
                return {
                    tasks: loanApplicationTasks,
                    data: loanApplicationData,
                    dataName: "application"
                }
            case "predictive-maintenance":
                return {
                    tasks: predictiveMaintenanceTasks,
                    data: trainSensorData,
                    dataName: "sensor data"
                }
            default:
                return {
                    tasks: medicalClaimTasks,
                    data: medicalClaimData,
                    dataName: "claim"
                }
        }
    }

    // Instead of destructuring to variables, use the function directly when needed
    // This removes the variable naming conflict

    // Scroll to bottom of messages when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, selectedTask])

    const handleScenarioSelect = (scenarioId: string) => {
        setSelectedScenario(scenarioId)
        setCurrentStep("task-selection")
    }

    const handleTaskSelect = (taskId: string) => {
        setSelectedTask(taskId)
        setCurrentStep("chat")

        // Initialize messages for this task if not already done
        if (!messages[taskId]) {
            const { tasks, dataName } = getScenarioData();
            const selectedTaskData = tasks.find((t) => t.id === taskId);
            
            setMessages((prev) => ({
                ...prev,
                [taskId]: [
                    {
                        id: `msg-${Date.now()}`,
                        role: "system",
                        content: `You've selected the "${selectedTaskData?.title}" task. Enter a prompt to analyze the ${dataName}.`,
                    },
                ],
            }))
        }
    }

    const handleBackToTasks = () => {
        setCurrentStep("task-selection")
        setShowSavedPrompts(false)
    }

    const handleSendMessage = () => {
        if (!selectedTask || !inputMessage.trim()) return

        const messageId = `msg-${Date.now()}`
        const isPrompt = inputMessage.toLowerCase().includes("prompt:") || messages[selectedTask]?.length <= 1 // First user message is considered a prompt

        const newMessage: Message = {
            id: messageId,
            role: "user",
            content: inputMessage,
            isPrompt,
        }

        setMessages((prev) => ({
            ...prev,
            [selectedTask]: [...(prev[selectedTask] || []), newMessage],
        }))

        setInputMessage("")

        // Simulate AI response
        setTimeout(() => {
            const { tasks } = getScenarioData();
            const task = tasks.find((t) => t.id === selectedTask)

            const responseMessage: Message = {
                id: `msg-${Date.now()}`,
                role: "assistant",
                content: `This is a simulated response for the ${task?.title} task. In a real application, this would be the AI's analysis based on your ${isPrompt ? "prompt" : "message"}.`,
            }

            setMessages((prev) => ({
                ...prev,
                [selectedTask!]: [...prev[selectedTask!], responseMessage],
            }))
        }, 1000)
    }

    const savePrompt = (messageId: string) => {
        if (!selectedTask || !selectedScenario) return

        const message = messages[selectedTask]?.find((m) => m.id === messageId)
        if (!message || message.role !== "user") return

        const promptId = `prompt-${Date.now()}`

        // Save the prompt
        const newSavedPrompt: SavedPrompt = {
            id: promptId,
            taskId: selectedTask,
            text: message.content,
            timestamp: Date.now(),
            scenarioId: selectedScenario
        }

        setSavedPrompts((prev) => [...prev, newSavedPrompt])

        // Update the message to mark it as a saved prompt
        setMessages((prev) => ({
            ...prev,
            [selectedTask]: prev[selectedTask].map((m) => (m.id === messageId ? { ...m, isPrompt: true, promptId } : m)),
        }))
    }

    const handleUsePrompt = (promptId: string) => {
        const prompt = savedPrompts.find((p) => p.id === promptId)
        if (!prompt) return

        setInputMessage(prompt.text)

        // If we're not already on the task for this prompt, switch to it
        if (selectedScenario !== prompt.scenarioId) {
            setSelectedScenario(prompt.scenarioId)
        }
        
        if (selectedTask !== prompt.taskId) {
            setSelectedTask(prompt.taskId)
            setCurrentStep("chat")
        }

        setShowSavedPrompts(false)
    }

    // Toggle saved prompts panel
    const toggleSavedPrompts = () => {
        setShowSavedPrompts(prev => !prev)
    }
    
    // Handle back navigation based on current step
    const handleBackNavigation = () => {
        if (currentStep === "scenario") {
            // Go back to week1 page
            router.push('/week1');
        } else if (currentStep === "task-selection") {
            // Go back to scenario selection
            setCurrentStep("scenario");
            setSelectedScenario(null);
        } else if (currentStep === "chat") {
            // Go back to task selection
            setCurrentStep("task-selection");
        }
    };

    // Function to clear chat
    const handleClearChat = () => {
        if (!selectedTask) return;
        
        const { tasks, dataName } = getScenarioData();
        
        setMessages((prev) => ({
            ...prev,
            [selectedTask]: [{
                id: `msg-${Date.now()}`,
                role: "system",
                content: `You've selected the "${tasks.find(t => t.id === selectedTask)?.title}" task. Enter a prompt to analyze the ${dataName}.`,
            }]
        }));
        
        setInputMessage("");
    };

    // Get appropriate navbar title based on current step
    const getNavbarTitle = () => {
        if (currentStep === "scenario") {
            return "Scenario Selection";
        } else if (currentStep === "task-selection") {
            const scenario = scenarioData.find(s => s.id === selectedScenario);
            return scenario?.title || "Task Selection";
        } else if (currentStep === "chat") {
            const { tasks } = getScenarioData();
            const task = tasks.find(t => t.id === selectedTask);
            return task?.title || "Chat";
        }
        return "Playground";
    };

    // Get the current scenario data for rendering
    const currentScenarioData = getScenarioData();

    const navSteps = [
        {
          number: 1,
          label: "Scenario",
          isActive: currentStep === "scenario",
          isCompleted: currentStep === "task-selection" || currentStep === "chat"
        },
        {
          number: 2,
          label: "Task",
          isActive: currentStep === "task-selection",
          isCompleted: currentStep === "chat"
        },
        {
          number: 3,
          label: "Prompt",
          isActive: currentStep === "chat",
          isCompleted: false
        }
    ];

    return (
        <div className="flex flex-col h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white">
            <MainNavbar 
                title={""} // Add the title prop using the function you already have
                onBack={handleBackNavigation}
                backLabel={currentStep === "scenario" ? "Back" : "Back"}
                onClear={currentStep === "chat" ? handleClearChat : undefined}
            />

            {/* Add the progress indicator here */}
            <div className="flex justify-center py-4 bg-gray-900/50 border-b border-gray-800">
                <div className="flex items-center">
                    {navSteps.map((navStep, index) => (
                        <Fragment key={navStep.number}>
                            {/* Step indicator */}
                            <div className="flex flex-col items-center">
                                <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                                    ${navStep.isActive 
                                        ? 'bg-indigo-600 text-white' 
                                        : navStep.isCompleted 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-700 text-gray-300'
                                    }`}
                                >
                                    {navStep.isCompleted ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        navStep.number
                                    )}
                                </div>
                                <span className={`text-xs ${navStep.isActive ? 'text-indigo-300 font-medium' : 'text-gray-400'}`}>
                                    {navStep.label}
                                </span>
                            </div>
                            
                            {/* Connector line between steps (except after the last step) */}
                            {index < navSteps.length - 1 && (
                                <div 
                                    className={`w-12 h-0.5 mx-2 
                                    ${index < (currentStep === "scenario" ? 0 : currentStep === "task-selection" ? 1 : 2) 
                                        ? 'bg-green-600' 
                                        : 'bg-gray-700'}`}
                                ></div>
                            )}
                        </Fragment>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <main className="min-h-full">
                    {currentStep === "scenario" && (
                        <ScenarioSelection 
                            scenarioData={scenarioData}
                            onSelect={handleScenarioSelect}
                        />
                    )}

                    {currentStep === "task-selection" && (
                        <TasksList
                            selectedScenario={selectedScenario}
                            tasks={currentScenarioData.tasks}
                            savedPrompts={savedPrompts.filter(p => p.scenarioId === selectedScenario)}
                            showSavedPrompts={showSavedPrompts}
                            scenarioData={scenarioData}
                            scenarioDetails={currentScenarioData.data}
                            toggleSavedPrompts={toggleSavedPrompts}
                            onTaskSelect={handleTaskSelect}
                            handleUsePrompt={handleUsePrompt}
                            dataName={currentScenarioData.dataName}
                        />
                    )}

                    {currentStep === "chat" && selectedTask && (
                        <ChatInterface
                            selectedTask={selectedTask}
                            selectedScenario={selectedScenario}
                            scenarioDescription={scenarioData.find(s => s.id === selectedScenario)?.description || ""}
                            tasks={currentScenarioData.tasks}
                            savedPrompts={savedPrompts.filter(p => p.scenarioId === selectedScenario)}
                            showSavedPrompts={showSavedPrompts}
                            messagesEndRef={messagesEndRef}
                            messages={messages}
                            inputMessage={inputMessage}
                            scenarioData={currentScenarioData.data}
                            dataName={currentScenarioData.dataName}
                            handleBackToTasks={handleBackToTasks}
                            toggleSavedPrompts={toggleSavedPrompts}
                            handleUsePrompt={handleUsePrompt}
                            savePrompt={savePrompt}
                            setInputMessage={setInputMessage}
                            handleSendMessage={handleSendMessage}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}