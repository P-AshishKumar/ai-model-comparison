"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from 'lucide-react'
import MainNavbar from "@/components/MainNavbar"

export default function LabExercisePage() {
  const router = useRouter()

  // The Google Colab link for the lab
  const COLAB_LINK = "https://colab.research.google.com/drive/1ZfUdAbP-03WqlTxG5n3ncjq7gEFmXC5W?usp=sharing"

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
        "Use clinical model (optional: en_ner_bc5cdr_md via scispaCy)"
      ]
    },
    {
      number: 3,
      title: "Document Embeddings",
      description: "Generate embeddings using sentence-transformers.",
      tasks: [
        "Use all-MiniLM-L6-v2 model",
        "Create vector representations for all documents"
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
      <MainNavbar 
        backUrl="/week2"
        backLabel="Back"
        onBack={() => router.push('/week2')}
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
              {/* Replace the external image with a local icon */}
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
            
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 mb-4">
              <p># Flatten for processing</p>
              <p>documents = []</p>
              <p>labels = []</p>
              <p>for domain, entries in texts.items():</p>
              <p className="ml-4">for entry in entries:</p>
              <p className="ml-8">documents.append(entry)</p>
              <p className="ml-8">labels.append(domain)</p>
              <p></p>
              <p>for i, doc in enumerate(documents):</p>
              <p className="ml-4">print(f"\n[&#123;labels[i]&#125;] &#123;doc&#125;")</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700/30">
                <h3 className="text-lg font-semibold text-blue-300 mb-2">🚂 Transport & Logistics</h3>
                <p className="text-sm text-gray-300">Locomotive maintenance documents</p>
              </div>
              
              <div className="p-4 bg-green-900/30 rounded-lg border border-green-700/30">
                <h3 className="text-lg font-semibold text-green-300 mb-2">🏥 Medical Insurance</h3>
                <p className="text-sm text-gray-300">Clinical and insurance claims documents</p>
              </div>
              
              <div className="p-4 bg-yellow-900/30 rounded-lg border border-yellow-700/30">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">💵 Finance and Loans</h3>
                <p className="text-sm text-gray-300">Loan application documents</p>
              </div>
            </div>
          </div>

          {/* Visualization Hint */}
          <div className="p-6 border rounded-lg bg-gray-900/40 border-purple-500/40 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🔍 Visualization Hints</h2>
            <p className="text-gray-300 mb-4">Use the following code to compute and visualize cosine similarity:</p>
            
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300 mb-4">
              <p># Compute similarity between embeddings</p>
              <p>similarity_score = cosine_similarity(embedding_doc1, embedding_doc2)</p>
              <p></p>
              <p>import seaborn as sns</p>
              <p>import matplotlib.pyplot as plt</p>
              <p>import numpy as np</p>
              <p></p>
              <p># Example cosine similarity matrix (replace with your actual matrix)</p>
              <p>cosine_sim_matrix = np.array([</p>
              <p className="ml-4">[1.0, 0.8, 0.2, 0.5],</p>
              <p className="ml-4">[0.8, 1.0, 0.3, 0.6],</p>
              <p className="ml-4">[0.2, 0.3, 1.0, 0.1],</p>
              <p className="ml-4">[0.5, 0.6, 0.1, 1.0]</p>
              <p>])</p>
              <p></p>
              <p># Plot the heatmap</p>
              <p>sns.heatmap(cosine_sim_matrix, annot=True, cmap="YlGnBu", fmt=".2f")</p>
              <p>plt.title("Cosine Similarity Heatmap")</p>
              <p>plt.xlabel("Documents")</p>
              <p>plt.ylabel("Documents")</p>
              <p>plt.show()</p>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800/50 py-6 mt-auto backdrop-blur-sm bg-black/20">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 AI-CCORE Bootcamp Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}