import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark } from "lucide-react"
import { iconTypes } from "./data"
import ClaimDetails from "./ClaimDetails"
import SavedPrompts from "./SavedPrompts"

interface TasksListProps {
    selectedScenario: string
    scenarioData: any[]
    tasks: any[]
    savedPrompts: any[]
    showSavedPrompts: boolean
    scenarioDetails: any
    dataName: string
    toggleSavedPrompts: () => void
    onTaskSelect: (taskId: string) => void
    handleUsePrompt: (promptId: string) => void
}

export default function TasksList({
    selectedScenario,
    scenarioData,
    tasks,
    savedPrompts,
    showSavedPrompts,
    scenarioDetails,
    dataName,
    toggleSavedPrompts,
    onTaskSelect,
    handleUsePrompt,
}: TasksListProps) {
    // Find the current scenario object based on the selected ID
    const currentScenario = scenarioData.find(s => s.id === selectedScenario)
    
    // Filter tasks for the current scenario
    const scenarioTasks = selectedScenario === "medical-claims" ? tasks.filter(t => !t.id.startsWith("medical-")) :
                          selectedScenario === "loan-application" ? tasks.filter(t => t.id.startsWith("loan-")) :
                          selectedScenario === "predictive-maintenance" ? tasks.filter(t => t.id.startsWith("train-")) :
                          tasks;
    
    // Filter saved prompts for the current scenario
    const scenarioSavedPrompts = savedPrompts.filter(p => p.scenarioId === selectedScenario);
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{currentScenario?.title}</h1>
                <div className="flex gap-2">
                    {scenarioSavedPrompts.length > 0 && (
                        <Button variant="outline" onClick={toggleSavedPrompts} className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            Saved Prompts ({scenarioSavedPrompts.length})
                        </Button>
                    )}
                </div>
            </div>

            <Card className="mb-8 border border-primary/20">
                <CardHeader className="bg-primary/5">
                    <CardTitle className="text-lg">Scenario Description</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-muted-foreground">{currentScenario?.description}</p>
                </CardContent>
            </Card>

            {/* Use double layout for claim details in TasksList */}
            <ClaimDetails 
                scenarioData={scenarioDetails} 
                dataName={dataName} 
                layout="double" 
            />

            {showSavedPrompts && scenarioSavedPrompts.length > 0 && (
                <SavedPrompts savedPrompts={scenarioSavedPrompts} tasks={scenarioTasks} handleUsePrompt={handleUsePrompt} />
            )}

            <h2 className="text-xl font-semibold mb-4">Select a Task</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarioTasks.map((task) => {
                    const hasSavedPrompt = scenarioSavedPrompts.some((p) => p.taskId === task.id)
                    const Icon = iconTypes[task.iconType]

                    return (
                        <Card
                            key={task.id}
                            className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                            onClick={() => onTaskSelect(task.id)}
                        >
                            <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                                <div className="mr-2 mt-0.5 bg-primary/10 p-2 rounded-full">
                                    {Icon && <Icon className="h-5 w-5" />}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{task.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{task.description}</p>
                                {hasSavedPrompt && (
                                    <div className="text-xs text-green-500 mt-2 flex items-center">
                                        <Bookmark className="h-3 w-3 mr-1" />
                                        You have saved prompts for this task
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}