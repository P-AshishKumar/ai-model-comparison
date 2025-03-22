"use client"

import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainNavbar from "@/components/MainNavbar"
import Screen1 from "../Screen1"

// Remove this as it's not compatible with 'use client' components
// export const metadata: Metadata = {
//   title: "Dashboard | UNO AI Bootcamp",
//   description: "Your UNO AI Bootcamp dashboard",
// }

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("")
  const router = useRouter()

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <MainNavbar
        title={""}
        rightContent={
          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-gray-200">Welcome {userName || "User"}</span> */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Logout
            </button>
          </div>
        }
      />

      <Screen1 />
    </div>
  )
}

