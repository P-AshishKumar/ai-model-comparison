import { FileText, CheckCircle2, AlertCircle, DollarSign, Zap } from "lucide-react"
import { LucideIcon } from "lucide-react"

// Common type for icon representation in a TS file
type TaskIcon = {
  icon: LucideIcon
}

export const scenarioData = [
  {
    id: "medical-claims",
    title: "Claims Processing",
    description:
      "Employees at Insurance Agencies work with large volumes of  claims that need to be processed efficiently while ensuring accuracy in claim codes, fraud detection, and compliance with insurance policies. The goal is to develop AI-powered automation that assists in claim validation, fraud detection, and ensuring compliance with regulatory requirements.",
  },
  {
    id: "loan-application",
    title: "Loan Application Review",
    description:
      "Banks and Credit Unions provide loans to individuals, organizations, and businesses. Employees review loan applications to assess eligibility, financial risk, and compliance with lending policies. The goal of this exercise is to refine AI-powered prompts that assist in automating the loan review process while ensuring accuracy and adherence to loan agencies lending guidelines.",
  },
  {
    id: "predictive-maintenance",
    title: "Transport Predictive Maintenance ",
    description:
      "In transport industries efficient maintenance of trucks, trains and tracks, ships, flights is critical for safety, cost reduction, and operational efficiency. Employees must monitor equipment conditions, predict failures, and schedule maintenance proactively to prevent delays and accidents. The goal of this exercise is to refine AI-powered prompts that assist in predictive maintenance decision-making while ensuring accurate and timely interventions.",
  }
]

export const medicalClaimData = {
  patientName: "John Doe",
  dateOfBirth: "03/15/1980",
  memberId: "BCBS123456789",
  providerName: "Dr. Emily Carter, MD",
  providerNPI: "1234567890",
  dateOfService: "02/25/2025",
  placeOfService: "Outpatient Clinic",
  diagnosisCode: "M54.5 (Low back pain)",
  procedureCode: "99214 (Office visit, established patient, moderate complexity)",
  billedAmount: "$250",
  allowedAmount: "$150",
  claimSubmissionDate: "02/26/2025",
  insurancePlan: "Blue Cross Blue Shield PPO",
  priorAuthRequired: "No",
  claimStatus: "Pending",
}

export const loanApplicationData = {
  applicantName: "Sarah Thompson",
  dateOfBirth: "06/12/1985",
  businessName: "Thompson Family Farms",
  loanType: "Operating Loan",
  requestedAmount: "$250,000",
  loanPurpose: "Purchase of farming equipment and operational expenses",
  creditScore: "720",
  annualRevenue: "$850,000",
  debtToIncomeRatio: "35%",
  collateral: "Farmland valued at $500,000",
  loanHistory: "No prior defaults, previous FCSA loan repaid in full",
  applicationDate: "03/10/2025",
  status: "Pending Review"
}

export const trainSensorData = {
  locomotiveId: "UPX-2045",
  engineTemperature: "210°F (Normal: 180-200°F)",
  brakeWearLevel: "85% worn (Threshold: 75% for servicing)",
  wheelBearingVibration: "6.5 mm/s² (Above normal range: 5 mm/s²)",
  fuelEfficiencyDrop: "15% decrease over last 3 months",
  lastMaintenanceDate: "12/15/2024 (Routine check)",
  predictedComponentFailure: "Brake system within 10-15 days"
}

// Export icon objects for each task domain
export const iconTypes = {
  fileText: FileText,
  checkCircle: CheckCircle2,
  alertCircle: AlertCircle,
  dollarSign: DollarSign,
  zap: Zap
}

export const medicalClaimTasks = [
  {
    id: "task1",
    title: "Basic Claim Data Extraction",
    description: "Extract and validate key information from the medical claim.",
    iconType: "fileText",
  },
  {
    id: "task2",
    title: "Eligibility & Compliance Check",
    description: "Verify patient eligibility and ensure compliance with insurance policies.",
    iconType: "checkCircle",
  },
  {
    id: "task3",
    title: "Claim Status Evaluation",
    description: "Evaluate the current status of the claim and recommend next steps.",
    iconType: "alertCircle",
  },
  {
    id: "task4",
    title: "Denial Risk Assessment",
    description: "Assess the risk of claim denial based on provided information.",
    iconType: "alertCircle",
  },
  {
    id: "task5",
    title: "Financial Impact Analysis",
    description: "Analyze the financial impact of the claim for both provider and insurer.",
    iconType: "dollarSign",
  },
  {
    id: "bonus",
    title: "Claim Processing Automation",
    description:
      "Consider how AI could automate claim analysis. Identify what structured outputs would be necessary for an AI system to efficiently process this claim and predict its approval or denial.",
    iconType: "zap",
  },
]

export const loanApplicationTasks = [
  {
    id: "loan-task1",
    title: "Extract Key Loan Application Details",
    description: "Extract and validate key information from the loan application.",
    iconType: "fileText",
  },
  {
    id: "loan-task2",
    title: "Assess Loan Eligibility",
    description: "Evaluate the applicant's eligibility based on provided information and lending criteria.",
    iconType: "checkCircle",
  },
  {
    id: "loan-task3",
    title: "Identify Potential Risks",
    description: "Identify potential risks and implement fraud detection measures.",
    iconType: "alertCircle",
  },
  {
    id: "loan-task4",
    title: "Justify Approval or Rejection",
    description: "Provide justification for approving or rejecting the loan application.",
    iconType: "alertCircle",
  },
  {
    id: "loan-task5",
    title: "Predict Possible Next Steps",
    description: "Predict the possible next steps in the loan processing workflow.",
    iconType: "dollarSign",
  },
  {
    id: "loan-bonus",
    title: "Automating Loan Evaluation with AI",
    description:
      "Consider how AI could assist in evaluating loan applications. Define structured outputs an AI model would need to generate a loan approval recommendation efficiently.",
    iconType: "zap",
  },
]

export const predictiveMaintenanceTasks = [
  {
    id: "maint-task1",
    title: "Extract Key Locomotive Diagnostics",
    description: "Extract and interpret key diagnostic information from locomotive sensor data.",
    iconType: "fileText",
  },
  {
    id: "maint-task2",
    title: "Assess Maintenance Urgency",
    description: "Evaluate the urgency of maintenance based on sensor readings and thresholds.",
    iconType: "checkCircle",
  },
  {
    id: "maint-task3",
    title: "Identify Potential Safety Risks",
    description: "Identify potential safety risks associated with the current locomotive condition.",
    iconType: "alertCircle",
  },
  {
    id: "maint-task4",
    title: "Predict Operational Impact",
    description: "Predict the operational impact if maintenance is delayed or performed immediately.",
    iconType: "dollarSign",
  },
  {
    id: "maint-task5",
    title: "Recommend Maintenance Actions",
    description: "Recommend specific proactive maintenance actions based on the diagnostic data.",
    iconType: "checkCircle",
  },
  {
    id: "maint-bonus",
    title: "AI-Powered Predictive Maintenance",
    description:
      "Define how AI could automate locomotive diagnostics and maintenance scheduling. Identify key data points an AI system should analyze and predict to enhance reliability and efficiency.",
    iconType: "zap",
  },
]