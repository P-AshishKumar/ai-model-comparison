import type { Metadata } from "next"
import LoginForm from "@/components/login-form"
import AnimatedBackground from "@/components/animated-background"

export const metadata: Metadata = {
  title: "Login | UNO AI Bootcamp",
  description: "Login to your UNO AI Bootcamp account",
}

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <AnimatedBackground />
      <div className="z-10 w-full max-w-md px-4 sm:px-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Login to access your AI-CCORE Bootcamp dashboard</p>
        </div>
        <LoginForm />
        <div className="mt-4 p-4 bg-muted rounded-lg text-sm">
          <p className="font-medium">For testing, use these credentials:</p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  )
}

