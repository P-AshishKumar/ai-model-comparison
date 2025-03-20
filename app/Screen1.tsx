"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar" // Import MainNavbar

const Screen1 = () => {
    const router = useRouter();

    // Function to navigate to Screen2 when Week 1 is clicked
    const handleWeek1Click = () => {
        router.push('/week1');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
            {/* Replace the header with MainNavbar */}
            <MainNavbar 
                // title="AI Bootcamp Labs"
                // subtitle="Learning Portal"
                // No backUrl needed here since this is the main page
                // rightContent={
                //     <div className="flex items-center gap-2">
                //         <span className="text-sm text-gray-400">AI-CCORE</span>
                //     </div>
                // }
            />

            {/* Main content */}
            <main className="flex-grow container mx-auto py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        AI-CCORE <span className="text-indigo-400">Labs</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Explore our four-week curriculum with hands-on lab exercises
                    </p>
                </div>

                {/* Week grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Week 1 Card - Enabled */}
                    <Card className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Week 1</CardTitle>
                            <CardDescription className="text-indigo-200">AI Model Comparison</CardDescription>
                        </CardHeader>
                        {/* <CardContent className="text-gray-200">
                            <p>Compare responses from leading LLMs including GPT-4o, Claude, and Gemini. Analyze performance across different prompting techniques.</p>
                        </CardContent> */}
                        <CardFooter>
                            <Button
                                onClick={handleWeek1Click}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Access Lab <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Week 2 Card - Disabled */}
                    <Card className="bg-gray-900/80 border border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-200">Week 2</CardTitle>
                            <CardDescription className="text-gray-400">Prompt Engineering</CardDescription>
                        </CardHeader>
                        {/* <CardContent className="text-gray-300">
                            <p>Learn advanced prompt engineering techniques to get the most effective results from different AI models.</p>
                        </CardContent> */}
                        <CardFooter>
                            <Button
                                disabled
                                className="w-full bg-gray-800 text-gray-400 cursor-not-allowed"
                            >
                                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Week 3 Card - Disabled */}
                    <Card className="bg-gray-900/80 border border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-200">Week 3</CardTitle>
                            <CardDescription className="text-gray-400">RAG Implementation</CardDescription>
                        </CardHeader>
                        {/* <CardContent className="text-gray-300">
                            <p>Build Retrieval-Augmented Generation systems to enhance LLM responses with external knowledge sources.</p>
                        </CardContent> */}
                        <CardFooter>
                            <Button
                                disabled
                                className="w-full bg-gray-800 text-gray-400 cursor-not-allowed"
                            >
                                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Week 4 Card - Disabled */}
                    <Card className="bg-gray-900/80 border border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-200">Week 4</CardTitle>
                            <CardDescription className="text-gray-400">Fine-tuning & Evaluation</CardDescription>
                        </CardHeader>
                        {/* <CardContent className="text-gray-300">
                            <p>Learn techniques for customizing foundation models and properly evaluating AI model performance.</p>
                        </CardContent> */}
                        <CardFooter>
                            <Button
                                disabled
                                className="w-full bg-gray-800 text-gray-400 cursor-not-allowed"
                            >
                                Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                    <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Screen1;