import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    // Clear the session cookie
    const response = NextResponse.json({ success: true }, { status: 200 })

    response.cookies.set({
      name: "session_token",
      value: "",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error logging out:", error)

    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

