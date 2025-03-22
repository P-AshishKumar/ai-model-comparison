import { NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Connect to the Neon database
    console.log("Has entered the URL")
    console.log("Database URL", process.env.DATABASE_URL)
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Hash the password
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // Insert the user into the database
      await sql(
        'INSERT INTO user_login (username, email, password_hash) VALUES ($1, $2, $3)',
        [name, email, password_hash]
      );

      // Return success response (don't include sensitive data)
      return NextResponse.json(
        {
          success: true,
          message: "Registration successful",
          user: { name, email }
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error("Database error:", dbError);

      // Handle duplicate key errors
      if (dbError.code === '23505') { // PostgreSQL unique violation code
        if (dbError.message.includes('email')) {
          return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        if (dbError.message.includes('username')) {
          return NextResponse.json({ error: "Username already taken" }, { status: 409 });
        }
        return NextResponse.json({ error: "User already exists" }, { status: 409 });
      }

      throw dbError; // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error("Error in register API:", error);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}