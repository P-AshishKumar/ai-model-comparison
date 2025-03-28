"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Key, Copy, Check } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useApiStore } from "@/hooks/useApiStore"

// Helper function to mask API keys
const maskApiKey = (key: string): string => {
  if (!key || key === "sk-..." || key === "AIza..." || key === "sk-ant-...") {
    return "Not configured";
  }
  // Only show first 4 and last 4 characters
  return key.length <= 8
    ? "********"
    : `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

export default function LabExercisePage() {
  const router = useRouter()
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  // Get API keys from the store
  const { apiKeys: storeApiKeys } = useApiStore()

  // API keys for the modal - use keys from store or fallback to placeholders
  const [apiKeys, setApiKeys] = useState([
    { name: "OPENAI_API_KEY", value: "sk-..." },
    { name: "GOOGLE_API_KEY", value: "AIza..." },
    { name: "ANTHROPIC_API_KEY", value: "sk-ant-..." }
  ])

  // The Google Colab link for the lab
  const COLAB_LINK = "https://colab.research.google.com/drive/1ZfUdAbP-03WqlTxG5n3ncjq7gEFmXC5W?usp=sharing"

  // Effect to update API keys when store changes
  useEffect(() => {
    if (storeApiKeys) {
      setApiKeys([
        { name: "OPENAI_API_KEY", value: storeApiKeys.openai_api_key || "sk-..." },
        { name: "GOOGLE_API_KEY", value: storeApiKeys.google_generative_ai_api_key || "AIza..." },
        { name: "ANTHROPIC_API_KEY", value: storeApiKeys.anthropic_api_key || "sk-ant-..." }
      ]);
    } else {
      // Try loading from localStorage as fallback
      try {
        const storedKeys = localStorage.getItem('apiKeys');
        if (storedKeys) {
          const parsedKeys = JSON.parse(storedKeys);
          setApiKeys([
            { name: "OPENAI_API_KEY", value: parsedKeys.openai_api_key || "sk-..." },
            { name: "GOOGLE_API_KEY", value: parsedKeys.google_generative_ai_api_key || "AIza..." },
            { name: "ANTHROPIC_API_KEY", value: parsedKeys.anthropic_api_key || "sk-ant-..." }
          ]);
        }
      } catch (error) {
        console.warn("Error loading API keys from localStorage:", error);
      }
    }
  }, [storeApiKeys]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      number: 1,
      title: "Text Preprocessing",
      description: "Use spaCy and NLTK for text preprocessing tasks.",
      tasks: [
        "Word tokenization",
        "Stemming (using NLTK)",
        "POS tagging"
      ]
    },
    {
      number: 2,
      title: "Named Entity Recognition (NER)",
      description: "Identify key concepts using various NER models.",
      tasks: [
        "Use spaCy for basic NER",
        "Apply LLM-based model (dslim/bert-base-NER)",
      ]
    },
    {
      number: 3,
      title: "Document Embeddings",
      description: "Generate embeddings using sentence-transformers.",
      tasks: [
        "Use all-MiniLM-L6-v2 model",
        "Create vector representations for all documents",
        "Hint: Flatten all the documents into a single list"
      ]
    },
    {
      number: 4,
      title: "Cross-Domain Document Similarity",
      description: "Compare all documents using cosine similarity.",
      tasks: [
        "Calculate similarity scores between all 9 documents",
        "Create a comprehensive similarity matrix",
        "Visualize using a heatmap"
      ]
    },
    {
      number: 5,
      title: "Transport & Logistics vs Medical Insurance",
      description: "Compare similarity between documents from these domains.",
      tasks: [
        "Calculate cosine similarity between the two domains",
        "Create a similarity matrix",
        "Visualize results with a heatmap"
      ]
    },
    {
      number: 6,
      title: "Finance and Loans vs Medical Insurance",
      description: "Compare similarity between documents from these domains.",
      tasks: [
        "Calculate cosine similarity between the two domains",
        "Create a similarity matrix",
        "Visualize results with a heatmap"
      ]
    },
    {
      number: 7,
      title: "Transport & Logistics vs Finance and Loans",
      description: "Compare similarity between documents from these domains.",
      tasks: [
        "Calculate cosine similarity between the two domains",
        "Create a similarity matrix",
        "Visualize results with a heatmap"
      ]
    },
    {
      number: 8,
      title: "Final Output",
      description: "Ensure all required outputs are completed.",
      tasks: [
        "4 similarity matrices",
        "4 visualizations",
        "Analysis of findings"
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <TooltipProvider>
        <MainNavbar 
          backUrl="/week2"
          backLabel="Back"
          onBack={() => router.push('/week2')}
          rightContent={
            <Button
              onClick={() => setShowApiKeys(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-9 flex items-center gap-2 px-3"
              size="sm"
            >
              <Key className="h-4 w-4" />
              API Keys
            </Button>
          }
        />

        <main className="flex-grow container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Week 2 <span className="text-purple-400">NLP Pipeline Lab</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              Build a complete NLP pipeline using sample text from three domains
            </p>
            
            {/* Google Colab Button */}
            <div className="flex justify-center mt-6 mb-2">
              <Button
                onClick={() => window.open(COLAB_LINK, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                size="lg"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  className="mr-2"
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V5c0-1.1-0.9-2-2-2z" fill="#F9AB00"/>
                  <rect x="7" y="7" width="10" height="2" rx="1" fill="white"/>
                  <rect x="7" y="11" width="10" height="2" rx="1" fill="white"/>
                  <rect x="7" y="15" width="5" height="2" rx="1" fill="white"/>
                </svg>
                Open Lab in Google Colab
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-400 mb-10">
              Complete the exercises in the Colab notebook following the instructions below
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Resources section */}
            <div className="p-6 border rounded-lg bg-gray-900/40 border-indigo-500/40 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">🔧 Requirements</h2>
              <div className="bg-black/30 rounded-lg p-4 mb-4 font-mono text-sm text-gray-300">
                <p>!pip install spacy nltk sentence-transformers matplotlib seaborn pandas</p>
                <p>!python -m nltk.downloader punkt</p>
                <p>!python -m spacy download en_core_web_sm</p>
                <p className="mt-2 text-gray-400">Optional (for clinical model):</p>
                <p>!pip install scispacy</p>
                <p>!pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.5.4/en_ner_bc5cdr_md-0.5.4.tar.gz</p>
              </div>
              
              <h3 className="text-xl font-semibold text-indigo-300 mb-2">📚 Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: "spaCy Documentation", url: "https://spacy.io/docs" },
                  { name: "NLTK Documentation", url: "https://www.nltk.org/" },
                  { name: "Sentence Transformers", url: "https://www.sbert.net/" },
                  { name: "Hugging Face Transformers", url: "https://huggingface.co/docs/transformers/index" },
                  { name: "SciSpaCy", url: "https://allenai.github.io/scispacy/" }
                ].map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded border border-gray-700/50 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2 text-indigo-400" />
                    <span className="flex-1">{resource.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                ))}
              </div>
            </div>

            {/* Sample Data section */}
            <div className="p-6 border rounded-lg bg-gray-900/40 border-indigo-500/40 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📄 Sample Data</h2>
              <p className="text-gray-300 mb-4">In this lab, you'll work with sample text from three domains:</p>
              
              <div className="mb-6">
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
                  <p className="text-indigo-300 mb-2">texts = &#123;</p>
                  <p className="ml-4 text-blue-300">"Transport & Logistics": [</p>
                  <p className="ml-8">"The UPX-2013 locomotive experienced a power failure near Cheyenne.",</p>
                  <p className="ml-8">"UPX-2045 had a brake malfunction during inspection. Replacement scheduled.",</p>
                  <p className="ml-8">"A cooling fan failure was reported in engine UPX-4092. Emergency repairs initiated."</p>
                  <p className="ml-4">],</p>
                  <p className="ml-4 text-green-300">"Medical Insurance": [</p>
                  <p className="ml-8">"Patient Jane Doe was diagnosed with hypertension and prescribed lisinopril.",</p>
                  <p className="ml-8">"Mary Smith experienced dizziness and was prescribed metoprolol.",</p>
                  <p className="ml-8">"John K. visited the clinic with chest pain and was diagnosed with angina."</p>
                  <p className="ml-4">],</p>
                  <p className="ml-4 text-yellow-300">"Finance and Loans": [</p>
                  <p className="ml-8">"Tom Hanks applied for a $200,000 loan to expand his soybean farm.",</p>
                  <p className="ml-8">"Ashley applied for a $180,000 loan to purchase farmland for wheat cultivation.",</p>
                  <p className="ml-8">"A $250,000 loan was requested by George M. for building grain storage facilities."</p>
                  <p className="ml-4">]</p>
                  <p>&#125;</p>
                </div>
              </div>
              
            </div>

            {/* Steps */}
            {steps.map((step) => (
              <div 
                key={step.number}
                className="p-6 border rounded-lg bg-gray-900/40 border-gray-800/60"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 bg-gray-800 text-gray-300">
                    {step.number}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      {step.tasks.map((task, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-5 h-5 mt-0.5 mr-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                          </div>
                          <p className="text-gray-300">{task}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add visualization hint to step 4 */}
                    {step.number === 4 && (
                      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-purple-300 mb-2">🔍 Visualization Code</h4>
                        <p className="text-gray-300 mb-3">Use the following code to compute and visualize cosine similarity:</p>
                        
                        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
                          <p># Compute cosine similarity</p>
                          <p>similarity_matrix = cosine_similarity(embeddings)
                          </p>
                          <p># Plot the heatmap</p>
                          <p>sns.heatmap(similarity_matrix, xticklabels=doc_labels, yticklabels=doc_labels,
                              cmap="coolwarm", annot=True)</p>
                          <p>plt.title("Document Similarity Heatmap (Cosine Scores)")</p>
                          <p>plt.xticks(rotation=45, ha='right')</p>
                          <p>plt.yticks(rotation=0)</p>
                          <p>plt.tight_layout()</p>
                          <p>plt.show()</p>
                        </div>
                      </div>
                    )}

                    {/* Add visualization hint to step 5 */}
                    {step.number === 5 && (
                      <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-purple-300 mb-2">🔍 Visualization Code</h4>
                        <p className="text-gray-300 mb-3">! Use the following code to compute cosine similarity between embeddings for doc1 and doc2</p>
                        
                        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
                          <p># Compute cosine similarity</p>
                          <p>similarity_score = cosine_similarity(embedding_doc1, embedding_doc2)
                          </p>
                          <p># Plot the heatmap</p>
                          <p>plt.figure(figsize=(8, 6))</p>
                          <p>sns.heatmap(similarity_matrix, annot=True, fmt=".2f", cmap="YlOrBr",
                              xticklabels=medical_labels, yticklabels=transport_labels)</p>
                          <p>plt.title("Cosine Similarity: Transport vs Medical Insurance")</p>
                          <p>plt.xlabel("Medical Insurance Documents")</p>
                          <p>plt.ylabel("Transport & Logistics Documents")</p>
                          <p>plt.tight_layout()</p>
                          <p>plt.show()</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* API Keys Dialog */}
        <Dialog open={showApiKeys} onOpenChange={setShowApiKeys}>
          <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">API Keys Configuration</DialogTitle>
              <DialogDescription>
                These keys are required for connecting to various LLM providers.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {apiKeys.map((key, index) => (
                <div key={key.name} className="flex items-center justify-between">
                  <div className="font-mono text-sm text-gray-300">{key.name}</div>
                  <div className="flex items-center">
                    <div className="font-mono text-sm bg-gray-800 px-3 py-1 rounded-l border border-gray-700">
                      {maskApiKey(key.value)}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleCopy(key.value, index)}
                          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-r border-t border-r border-b border-gray-700"
                        >
                          {copiedIndex === index ?
                            <Check className="h-4 w-4 text-green-400" /> :
                            <Copy className="h-4 w-4 text-gray-300" />
                          }
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {copiedIndex === index ? "Copied!" : "Copy full API key"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                onClick={() => setShowApiKeys(false)}
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>

      <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}