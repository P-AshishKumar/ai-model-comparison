"use client"

import { useEffect, useState } from "react"
import Exercise2Page from "../prompt-techniques"
import { useRouter } from 'next/navigation'

export default function Playground2Route() {
  const router = useRouter()
  const [previousDocument, setPreviousDocument] = useState<string | null>(null)
  
  // Check for previously uploaded document
  useEffect(() => {
    const storedFileName = localStorage.getItem('uploadedDocumentName')
    if (storedFileName) {
      setPreviousDocument(storedFileName)
    }
  }, [])
  
  return <Exercise2Page initialFileName={previousDocument} />
}