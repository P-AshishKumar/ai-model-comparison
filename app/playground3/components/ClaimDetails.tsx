import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClaimDetailsProps {
    scenarioData: Record<string, string> | null | undefined
    dataName: string
}

export default function ClaimDetails({ 
    scenarioData, 
    dataName
}: ClaimDetailsProps) {
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

    return (
        <Card className="mb-6 border border-primary/20">
            <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">{dataName.charAt(0).toUpperCase() + dataName.slice(1)} Details</CardTitle>
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