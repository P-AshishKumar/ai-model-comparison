import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ScenarioData {
    id: string
    title: string
    description: string
}

interface ScenarioSelectionProps {
    scenarioData: ScenarioData[]
    onSelect: (scenarioId: string) => void
}

export default function ScenarioSelection({ scenarioData, onSelect }: ScenarioSelectionProps) {
    return (
        <div className="container mx-auto px-4 h-full flex flex-col justify-center max-w-5xl">
            <div className="text-center mb-6  mt-5">
                <h2 className="text-xl md:text-2xl font-semibold text-white">Exercise 3 <span className="text-indigo-400">Design Prompt</span></h2>
            </div>
            <div className="text-center mb-12 mt-16">
                <h1 className="text-4xl font-bold mb-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-200">
                        Select a Use Case
                    </span>
                </h1>
                <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
                    Choose a scenario to begin your analysis
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {scenarioData.map((scenario) => (
                    <Card 
                        key={scenario.id}
                        className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        onClick={() => onSelect(scenario.id)}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">{scenario.title}</CardTitle>
                            <CardDescription className="text-indigo-200 line-clamp-2">
                                {scenario.description.substring(0, 80)}
                                {scenario.description.length > 80 ? "..." : ""}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Button 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent double triggering
                                    onSelect(scenario.id);
                                }}
                            >
                                <span className="flex items-center justify-center font-medium">
                                    Select Scenario <ChevronRight className="ml-2 h-5 w-5" />
                                </span>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}