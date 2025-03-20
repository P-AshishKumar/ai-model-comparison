import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"

interface TaskInfoProps {
    task: any
    scenarioData: any
    toggleDataVisibility: () => void
    dataName: string
}

export default function TaskInfo({ task, scenarioData, toggleDataVisibility, dataName }: TaskInfoProps) {
    // Get display fields based on data type
    const displayFields = getDisplayFieldsForScenario(dataName, scenarioData)

    return (
        <Card className="sticky top-4">
            <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium mb-1">Description</h3>
                        <p className="text-muted-foreground">{task?.description}</p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-medium mb-1">{dataName.charAt(0).toUpperCase() + dataName.slice(1)} Summary</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            {displayFields.map((field, index) => (
                                <p key={index}>
                                    <span className="font-medium">{field.label}:</span> {field.value}
                                </p>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 w-full" onClick={toggleDataVisibility}>
                            <FileText className="h-4 w-4 mr-1" />
                            View Full {dataName.charAt(0).toUpperCase() + dataName.slice(1)} Details
                        </Button>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-medium mb-1">Tips</h3>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                            <li>Be specific in your prompt about what you want to analyze</li>
                            <li>Include key fields that are relevant to this task</li>
                            <li>Save prompts that give good results for future use</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Helper function to get display fields based on scenario type
function getDisplayFieldsForScenario(dataName: string, data: any) {
    if (!data) return [];
    
    switch(dataName) {
        case "claim":
            return [
                { label: "Patient", value: data.patientName },
                { label: "Diagnosis", value: data.diagnosisCode },
                { label: "Procedure", value: data.procedureCode },
                { label: "Amount", value: data.billedAmount },
                { label: "Status", value: data.claimStatus }
            ];
        case "application":
            return [
                { label: "Applicant", value: data.applicantName },
                { label: "Business", value: data.businessName },
                { label: "Amount", value: data.requestedAmount },
                { label: "Credit Score", value: data.creditScore },
                { label: "Status", value: data.status }
            ];
        case "sensor data":
            return [
                { label: "Locomotive ID", value: data.locomotiveId },
                { label: "Engine Temp", value: data.engineTemperature },
                { label: "Brake Wear", value: data.brakeWearLevel },
                { label: "Vibration", value: data.wheelBearingVibration },
                { label: "Last Maintenance", value: data.lastMaintenanceDate }
            ];
        default:
            // Generic approach: Show first 5 properties if scenario type is unknown
            return Object.entries(data)
                .slice(0, 5)
                .map(([key, value]) => ({
                    label: key.replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                        .replace(/Id/g, "ID"),
                    value
                }));
    }
}