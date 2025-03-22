import { NextResponse } from "next/server"
import crypto from "crypto"
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcrypt'

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Accept dummy credentials for testing
    if (email === "test@example.com" && password === "password123") {
      // Create a dummy session
      const sessionToken = generateSessionToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Session expires in 7 days

      // Set the session cookie
      const response = NextResponse.json({ 
        success: true, 
        message: "Login successful",
        redirect: "/dashboard",  // Add explicit redirect path
        // Add mock API keys for test user
        apiKeys: {
          openai_api_key: "sk-test-openai-key-123456789",
          anthropic_api_key: "sk-ant-test-key-987654321",
          google_generative_ai_api_key: "test-google-key-abcdefg"
        }
      }, { status: 200 })

      response.cookies.set({
        name: "session_token",
        value: sessionToken,
        expires: expiresAt,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      })

      return response
    }

    // Connect to the database and check user credentials
    const sql = neon(`${process.env.DATABASE_URL}`);
    
    // Find user by email - Include API keys in the query
    const user = await sql`
      SELECT 
        id, 
        username, 
        email, 
        password_hash,
        openai_api_key,
        anthropic_api_key,
        google_generative_ai_api_key
      FROM user_login 
      WHERE email = ${email} 
      LIMIT 1
    `
    
    // If no user found or password doesn't match
    if (!user || user.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, user[0].password_hash)
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }
    
    // Create session token
    const sessionToken = generateSessionToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days
    
    // Set the session cookie
    const response = NextResponse.json({ 
      success: true, 
      message: "Login successful",
      redirect: "/dashboard",
      // Include user's API keys in the response
      apiKeys: {
        openai_api_key: user[0].openai_api_key || null,
        anthropic_api_key: user[0].anthropic_api_key || null,
        google_generative_ai_api_key: user[0].google_generative_ai_api_key || null
      }
    }, { status: 200 })
    
    response.cookies.set({
      name: "session_token",
      value: sessionToken,
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    })
    
    // Store session in database (you can add this later if needed)
    // await sql`
    //   INSERT INTO sessions (user_id, token, expires_at)
    //   VALUES (${user[0].id}, ${sessionToken}, ${expiresAt})
    // `;
    
    return response
    
  } catch (error) {
    console.error("Error in login API:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

