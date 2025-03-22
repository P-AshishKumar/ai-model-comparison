import Link from "next/link"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/animated-background"
import aiCcoreLogo from '@/components/ailogo.svg'
import Image from "next/image" // Add this import

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <AnimatedBackground />
      <div className="z-10 text-center max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Logo centered above welcome text */}
        <div className="flex justify-center mb-6">
          <Image
            src={aiCcoreLogo} // Assuming the logo is in the public folder
            alt="AI-CCORE Logo"
            width={300}
            height={300}
            className="mb-2"
            priority
          />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          Welcome to <br />
          <div> <span className="text-primary whitespace-nowrap text-3xl sm:text-4xl md:text-5xl">UNO AI-CCORE BOOTCAMP</span> </div>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Learn cutting-edge AI skills and transform your career with our intensive bootcamp program.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Create an Account
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

