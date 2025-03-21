import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface ClaimDetailsProps {
    scenarioData: Record<string, string> | null | undefined
    dataName: string
}

export default function ClaimDetails({
    scenarioData,
    dataName
}: ClaimDetailsProps) {
    const [copied, setCopied] = useState(false)

    // Add a guard to handle undefined/null data
    if (!scenarioData) {
        return (
            <Card className="mb-6 border border-muted">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-lg">{dataName.charAt(0).toUpperCase() + dataName.slice(1)} Details</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                    <p className="text-muted-foreground">No {dataName} details available.</p>
                </CardContent>
            </Card>
        )
    }

    // Convert object entries to array
    const entries = Object.entries(scenarioData);

    // Function to copy all content to clipboard
    const handleCopy = () => {
        const textToCopy = entries.map(([key, value]) => `${value}`).join('\n\n');
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            // Reset the copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Card className="mb-6 border border-primary/20">
            <CardHeader className="bg-primary/5 flex flex-row items-center justify-between pr-4">
                <CardTitle className="text-lg">{dataName.charAt(0).toUpperCase() + dataName.slice(1)} Details</CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 w-8 p-0"
                    title="Copy all details"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-2">
                    {entries.map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}