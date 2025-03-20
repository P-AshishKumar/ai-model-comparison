import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, MessageSquare, Send, Bookmark, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ClaimDetails from "./ClaimDetails"
import SavedPrompts from "./SavedPrompts"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ChatInterfaceProps {
    selectedTask: string
    selectedScenario: string
    scenarioDescription: string
    tasks: any[]
    savedPrompts: any[]
    showSavedPrompts: boolean
    messagesEndRef: React.RefObject<HTMLDivElement>
    messages: Record<string, any[]>
    inputMessage: string
    scenarioData: any
    dataName: string
    handleBackToTasks: () => void
    toggleSavedPrompts: () => void
    handleUsePrompt: (promptId: string) => void
    savePrompt: (messageId: string) => void
    setInputMessage: (message: string) => void
    handleSendMessage: () => void
}

export default function ChatInterface({
    selectedTask,
    selectedScenario,
    scenarioDescription,
    tasks,
    savedPrompts,
    showSavedPrompts,
    messagesEndRef,
    messages,
    inputMessage,
    scenarioData,
    dataName,
    handleBackToTasks,
    toggleSavedPrompts,
    handleUsePrompt,
    savePrompt,
    setInputMessage,
    handleSendMessage: originalHandleSendMessage,
}: ChatInterfaceProps) {
    const task = tasks.find((t) => t.id === selectedTask)
    const taskPrompts = savedPrompts.filter((p) => p.taskId === selectedTask)
    const currentMessages = messages[selectedTask] || []
    
    // State for model selection and loading
    const [selectedModel, setSelectedModel] = useState<string>("gpt-4o")
    const [isLoading, setIsLoading] = useState(false)
    
    // Create a local message state for API-based chats
    const [localMessages, setLocalMessages] = useState<any[]>([])
    
    // When the parent messages change, update our local copy
    useEffect(() => {
        setLocalMessages(currentMessages);
    }, [currentMessages]);
    
    // Determine which messages to display - use local messages if we have any, otherwise use parent's
    const displayMessages = localMessages;
    
    const modelToEndpointMapping: { [key: string]: string } = {
        "gpt-4o": "openai",
        "claude-3-7-sonnet-20250219": "anthropic",
        "gemini-2.0-flash": "google"
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessageWithAPI()
        }
    }

    // Function to handle sending messages via API
    const handleSendMessageWithAPI = async () => {
        if (!inputMessage.trim() || !selectedTask) return
        
        // Create a user message
        const messageId = `msg-${Date.now()}`
        const isPrompt = inputMessage.toLowerCase().includes("prompt:") 
        
        // Add user message to local messages immediately
        const userMessage = {
            id: messageId,
            role: "user",
            content: inputMessage,
            isPrompt,
        }
        
        setLocalMessages([...displayMessages, userMessage])
        
        setInputMessage("")
        setIsLoading(true)
        
        try {
            let scenarioContext = "";
            if (scenarioData) {
                scenarioContext = "CONTEXT DATA:\n";
                Object.entries(scenarioData).forEach(([key, value]) => {
                    const formattedKey = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .replace(/Id/g, "ID")
                        .replace(/Npi/g, "NPI");
                    scenarioContext += `${formattedKey}: ${value}\n`;
                });
                scenarioContext += "\n";
            }
            
            const conversationHistory = displayMessages.map(msg => 
                `${msg.role}: ${msg.content}`
            ).join('\n');
            
                //const fullPrompt = `
                // Task: ${task?.title}
                // Task Description: ${task?.description}

                // ${scenarioContext}

                // Conversation History:
                // ${conversationHistory}

                // user: ${inputMessage}
                // `;

            const fullPrompt = `Conversation History: ${conversationHistory} user: ${inputMessage} `;
            
            // Get endpoint based on selected model
            const endpoint = modelToEndpointMapping[selectedModel];
            
            // Send request to API
            const response = await fetch(`/api/generate/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    model: selectedModel,
                    scenarioData: scenarioData,
                    dataName: dataName,
                    task: task?.title
                }),
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Add the AI response to the local messages
            const responseMessage = {
                id: `msg-${Date.now()}`,
                // role: "assistant",
                content: data.text,
            };
            
            setLocalMessages(prev => [...prev, responseMessage]);
            
        } catch (error) {
            console.error("Error getting model response:", error);
            const errorMessage = {
                id: `msg-${Date.now()}`,
                role: "system",
                content: "Sorry, there was a problem generating a response. Please try again.",
            };
            
            setLocalMessages(prev => [...prev, errorMessage]);
            
        } finally {
            setIsLoading(false);
        }
    }

    // Calculate the top position for fixed sidebars
    const navbarHeight = "3rem";
    const sidebarOffset = "3rem";
    
    const handleOriginalSend = () => {
        setLocalMessages([]);
        originalHandleSendMessage();
    };

    return (
        <div className="flex relative h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* Left sidebar - Scenario and Task description */}
            <div 
                className="hidden lg:block fixed left-0 bottom-0 border-r bg-background overflow-hidden"
                style={{ 
                    top: `calc(${navbarHeight} + ${sidebarOffset})`, 
                    height: `calc(100vh - ${navbarHeight} - ${sidebarOffset} - 1rem)`,
                    width: "16rem"
                }}
            >
                <div className="p-3 h-full">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="bg-muted/30 py-2">
                            <CardTitle className="text-md">Scenario</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 flex-1 overflow-hidden">
                            <ScrollArea className="h-full pr-2">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{scenarioDescription}</p>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Task Description</h3>
                                        <p className="text-sm text-muted-foreground">{task?.description}</p>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Tips</h3>
                                        <ul className="text-sm text-muted-foreground list-disc pl-4">
                                            <li>Be specific about what you want to analyze</li>
                                            <li>Include key fields relevant to this task</li>
                                            <li>Save effective prompts for future use</li>
                                        </ul>
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 overflow-hidden" style={{ marginLeft: "16rem", marginRight: "16rem" }}>
                <div className="container mx-auto px-4 py-4 h-full flex flex-col overflow-hidden">
                    {/* Header with navigation and task title */}
                    <div className="flex items-center mb-4">
                        <div className="flex justify-end items-center gap-2">
                            {/* Model selection dropdown */}
                            
                            
                            {taskPrompts.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleSavedPrompts}
                                    className="flex items-center gap-1"
                                >
                                    <Bookmark className="h-4 w-4" />
                                    Saved Prompts ({taskPrompts.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Show saved prompts panel if visible */}
                    {showSavedPrompts && savedPrompts.length > 0 && (
                        <SavedPrompts savedPrompts={savedPrompts} tasks={tasks} handleUsePrompt={handleUsePrompt} />
                    )}

                    {/* Chat area */}
                    <Card className="flex-1 flex flex-col mb-0 overflow-hidden">
                        <CardHeader className="bg-muted/30 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        <CardTitle className="text-md">
                                            AI Assistant ({selectedModel.split('-')[0].toUpperCase()})
                                        </CardTitle>
                                    </div>
                                    
                                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
                                            <SelectItem value="claude-3-7-sonnet-20250219">Claude 3.7 Sonnet</SelectItem>
                                            <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <CardDescription className="text-sm">
                                    Enter a prompt to {task?.description} 
                                </CardDescription>
                            </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-3">
                            <ScrollArea className="h-full pr-2">
                                <div className="flex flex-col gap-3">
                                    {displayMessages.map((message) => {
                                        const isSavedPrompt = message.promptId !== undefined
                                        const canSavePrompt = message.role === "user" && message.isPrompt && !isSavedPrompt

                                        return (
                                            <div
                                                key={message.id}
                                                className={`p-3 rounded-lg ${
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                                                        : message.role === "system"
                                                        ? "bg-muted/70 max-w-full"
                                                        : "bg-muted max-w-[80%]"
                                                }`}
                                            >
                                                {message.role === "user" && message.isPrompt && (
                                                    <div className="flex items-center gap-1 mb-1 text-xs font-medium text-primary-foreground/80">
                                                        {isSavedPrompt ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                                </svg>
                                                                Saved Prompt
                                                            </>
                                                        ) : (
                                                            "Prompt"
                                                        )}
                                                    </div>
                                                )}

                                                <div className="whitespace-pre-wrap">{message.content}</div>

                                                {canSavePrompt && (
                                                    <div className="flex justify-end mt-2">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => savePrompt(message.id)}
                                                            className="text-xs bg-primary-foreground/20 hover:bg-primary-foreground/30"
                                                        >
                                                            <Bookmark className="h-3 w-3 mr-1" />
                                                            Save Prompt
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    {/* Loading indicator */}
                                    {isLoading && (
                                        <div className="p-3 flex items-center gap-2 text-muted-foreground animate-pulse">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Generating response from {selectedModel.split('-')[0].toUpperCase()}...</span>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="border-t p-3">
                            <div className="flex w-full items-end gap-2">
                                <Textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message or prompt..."
                                    className="min-h-24 flex-2 resize-none"
                                    disabled={isLoading}
                                />
                                <Button 
                                    onClick={handleSendMessageWithAPI} 
                                    disabled={!inputMessage.trim() || isLoading} 
                                    size="icon" 
                                    className="h-24 w-24 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Right sidebar - Claim details */}
            <div 
                className="hidden lg:block fixed right-0 bottom-0 border-l bg-background overflow-auto"
                style={{ 
                    top: `calc(${navbarHeight} + ${sidebarOffset})`, 
                    height: `calc(100vh - ${navbarHeight} - ${sidebarOffset} - 1rem)`,
                    width: "16rem"
                }}
            >
                <div className="p-3 h-full">
                    <ClaimDetails 
                        scenarioData={scenarioData}
                        dataName={dataName}
                        layout="single"
                    />
                </div>
            </div>
        </div>
    )
}