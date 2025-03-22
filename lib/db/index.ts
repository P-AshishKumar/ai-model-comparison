import { neon } from "@neondatabase/serverless"

// Initialize database connection
export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }

  return neon(process.env.DATABASE_URL)
}

// User-related database functions
export async function createUser(name: string, email: string, passwordHash: string) {
  const sql = getDb()

  try {
    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING id, name, email, created_at
    `

    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  const sql = getDb()

  try {
    const result = await sql`
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = ${email}
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function createSession(userId: number, sessionToken: string, expiresAt: Date) {
  const sql = getDb()

  try {
    const result = await sql`
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt})
      RETURNING id, session_token, expires_at
    `

    return result[0]
  } catch (error) {
    console.error("Error creating session:", error)
    throw error
  }
}

export async function getSessionByToken(sessionToken: string) {
  const sql = getDb()

  try {
    const result = await sql`
      SELECT s.id, s.user_id, s.session_token, s.expires_at, u.name, u.email
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken}
        AND s.expires_at > NOW()
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting session by token:", error)
    throw error
  }
}

export async function deleteSession(sessionToken: string) {
  const sql = getDb()

  try {
    await sql`
      DELETE FROM sessions
      WHERE session_token = ${sessionToken}
    `

    return true
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}

