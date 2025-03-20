import { FileText, CheckCircle2, AlertCircle, DollarSign, Zap } from "lucide-react"
import { LucideIcon } from "lucide-react"
import ClaimDetails from "./ClaimDetails"

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
  claimDetails: `On February 25, 2025, John Doe, a 45-year-old marketing executive with a history of occasional back problems, visited Dr. Emily Carter at Riverside Medical Group's outpatient clinic. Mr. Doe had been experiencing worsening low back pain for approximately two weeks following a weekend of gardening at his suburban home. During the moderately complex office visit (CPT 99214), Dr. Carter evaluated his condition, diagnosed him with low back pain (ICD-10: M54.5), and prescribed muscle relaxants and physical therapy. The following day, February 26, the claim was submitted to doctors office to BCBs which is Mr. Doe's  insurance plan (Member ID: BCBS123456789). The visit was billed at $250, though the insurance's contracted rate allowed $150. No prior authorization was required for this service. The claim is currently in pending status while the insurance company processes it. Dr. Carter (NPI: 1234567890) expects payment to be processed within the standard 14-21 day timeframe.`
}

export const loanApplicationData = {
  claimDetails:`Sarah Thompson, a 39-year-old third-generation farmer from Cedar Valley, submitted a loan application on March 10, 2025, through the Farm Credit Service Administration. Her business, Thompson Family Farms (established 1978), is seeking a $250,000 operating loan primarily for purchasing a new John Deere tractor and covering seasonal planting expenses. With an impressive credit score of 720 and annual revenue of $850,000 from their diverse crop operation specializing in organic soybeans and corn, the application shows a manageable debt-to-income ratio of 35%. Sarah has offered her 120-acre parcel of fertile farmland (valued at $500,000) as collateral. Her loan history demonstrates financial responsibility, with no defaults and a previous FCSA loan completely repaid ahead of schedule. The application is currently pending review by regional loan officer Mark Jenkins, who typically processes similar requests within 14 business days. The unseasonably wet spring this year has prompted many local farmers to seek similar operating capital for delayed planting schedules.`
}

export const trainSensorData = {
 claimDetails:`Union Pacific locomotive UPX-2045, a GE Evolution Series diesel-electric engine operating on the Western Mountain route, is showing concerning maintenance indicators as of March 18, 2025. The locomotive's engine temperature of 210°F slightly exceeds normal operating range (180-200°F), likely due to the challenging 3.2% grade sections it regularly navigates. More worrying is the brake wear level at 85%, well beyond the 75% threshold that typically triggers immediate service. Engineers have also detected abnormal wheel bearing vibration measuring 6.5 mm/s² (normal range is below 5 mm/s²) during recent high-speed runs between Denver and Salt Lake City. Fuel efficiency has dropped 15% since December, despite the recent installation of aerodynamic fairings. The locomotive last underwent routine maintenance on December 15, 2024, when technicians noted minor cooling system irregularities but deemed them non-critical. Predictive analytics indicate potential brake system failure within 10-15 days, prompting operations manager Richard Chen to schedule emergency servicing at the Cheyenne maintenance facility for this weekend, requiring temporary reassignment of three freight routes.`
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