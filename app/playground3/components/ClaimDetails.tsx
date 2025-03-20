import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ClaimDetailsProps {
    scenarioData: Record<string, string> | null | undefined
    dataName: string
    layout?: "single" | "double" // Add layout prop
}

export default function ClaimDetails({ 
    scenarioData, 
    dataName, 
    layout = "single" // Default to single column
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

    // Convert object entries to array to split for two columns
    const entries = Object.entries(scenarioData);
    
    // For double column layout, split the entries
    const isDoubleLayout = layout === "double";
    const midPoint = Math.ceil(entries.length / 2);
    
    const firstColumn = isDoubleLayout ? entries.slice(0, midPoint) : entries;
    const secondColumn = isDoubleLayout ? entries.slice(midPoint) : [];

    return (
        <Card className="mb-6 border border-primary/20">
            <CardHeader className="bg-primary/5">
                <CardTitle className="text-lg">{dataName.charAt(0).toUpperCase() + dataName.slice(1)} Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className={isDoubleLayout ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2"}>
                    {/* First column */}
                    <div className="space-y-2">
                        {firstColumn.map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <span className="text-sm font-small text-muted-foreground">
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) => str.toUpperCase())
                                        .replace(/Id/g, "ID")
                                        .replace(/Npi/g, "NPI")}
                                    :
                                </span>
                                <span className="text-sm text-muted-foreground">{value}</span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Second column (only rendered for double layout) */}
                    {isDoubleLayout && (
                        <div className="space-y-2">
                            {secondColumn.map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (str) => str.toUpperCase())
                                            .replace(/Id/g, "ID")
                                            .replace(/Npi/g, "NPI")}
                                        :
                                    </span>
                                    <span className="text-sm text-muted-foreground">{value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}