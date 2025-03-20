import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Copy } from "lucide-react"

interface SavedPromptsProps {
    savedPrompts: any[]
    tasks: any[]
    handleUsePrompt: (promptId: string) => void
}

export default function SavedPrompts({ savedPrompts, tasks, handleUsePrompt }: SavedPromptsProps) {
    return (
        <Card className="mb-8 border border-primary/20">
            <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">Saved Prompts</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {savedPrompts.map((prompt) => {
                        const task = tasks.find((t) => t.id === prompt.taskId)
                        return (
                            <div
                                key={prompt.id}
                                className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                                onClick={() => handleUsePrompt(prompt.id)}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="bg-primary/10 p-1 rounded-full">{task?.icon}</div>
                                    <span className="font-medium">{task?.title}</span>
                                    <Check className="h-4 w-4 text-green-500 ml-auto" />
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{prompt.text}</p>
                                <div className="flex justify-end mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUsePrompt(prompt.id)
                                        }}
                                    >
                                        <Copy className="h-3 w-3 mr-1" />
                                        Use Prompt
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}