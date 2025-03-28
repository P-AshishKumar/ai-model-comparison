"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, CheckCircle, Clock } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar" // Import MainNavbar
import { redirect } from "next/navigation";

const Screen1 = () => {
    const router = useRouter();

    // Function to navigate to Screen2 when Week 1 is clicked
    const handleWeek1Click = () => {
        router.push('/week1');
    };

    const handleWeek2Click = () => {
        router.push('/week2');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
            {/* Replace the header with MainNavbar */}
            {/* <MainNavbar 
                title="AI Bootcamp Labs"
                subtitle="Learning Portal"
                No backUrl needed here since this is the main page
                rightContent={
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">AI-CCORE</span>
                    </div>
                }
            /> */}

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
                    {/* Week 1 Card - Completed */}
                    <Card className="bg-gradient-to-br from-green-900/60 to-teal-900/60 border border-green-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl text-white">Week 1</CardTitle>
                                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Completed
                                </span>
                            </div>
                            <CardDescription className="text-green-200">AI Model Comparison</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                            <Button
                                onClick={handleWeek1Click}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                                Review Lab <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <Button
                                onClick={() => window.open('https://unomail-my.sharepoint.com/:f:/g/personal/msubramaniam_unomaha_edu/Eoey1pUWPrpGudEb4dWgcRMBadGIcp7DHgW3VPf60hL88w?e=LBflNp', '_blank')}
                                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
                                variant="secondary"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Presentation Materials
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Week 2 Card - Active */}
                    <Card className="bg-gradient-to-br from-indigo-900/80 to-blue-900/80 border border-indigo-500/50 shadow-lg hover:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl text-white">Week 2</CardTitle>
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Current
                                </span>
                            </div>
                            <CardDescription className="text-indigo-200">NLP techniques</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
                            <Button
                                onClick={handleWeek2Click}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Access Lab <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <Button
                                onClick={() => window.open('https://unomail-my.sharepoint.com/:f:/g/personal/msubramaniam_unomaha_edu/ErT7mFo2lExEkMnyJutdf-QB7QikN9NLe8ndtxiV25O9HQ?e=wTpsch', '_blank')}
                                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
                                variant="secondary"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Presentation Materials
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Week 3 Card - Disabled */}
                    <Card className="bg-gray-900/80 border border-gray-800/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-200">Week 3</CardTitle>
                            {/* <CardDescription className="text-gray-400">RAG Implementation</CardDescription> */}
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
                            {/* <CardDescription className="text-gray-400">Fine-tuning & Evaluation</CardDescription> */}
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
                    <p>© 2025 AI-CCORE Bootcamp Labs. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Screen1;