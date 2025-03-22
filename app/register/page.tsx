import type { Metadata } from "next"
import RegisterForm from "@/components/register-form"
import AnimatedBackground from "@/components/animated-background"

export const metadata: Metadata = {
  title: "Register | UNO AI Bootcamp",
  description: "Create a new account for UNO AI Bootcamp",
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <AnimatedBackground />
      <div className="z-10 w-full max-w-md px-4 sm:px-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Join the AI Revolution</h1>
          <p className="text-muted-foreground mt-2">Create an account to enroll in the UNO AI Bootcamp</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

