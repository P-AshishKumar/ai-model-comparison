// This file defines the database schema for the application

// In a real application, you would use this schema with Drizzle ORM
// to create tables and interact with your Neon Postgres database

export const usersSchema = {
  id: "serial primary key",
  name: "text not null",
  email: "text not null unique",
  password_hash: "text not null", // Store hashed passwords, never plain text
  created_at: "timestamp with time zone default now()",
  updated_at: "timestamp with time zone default now()",
}

export const sessionsSchema = {
  id: "serial primary key",
  user_id: "integer not null references users(id) on delete cascade",
  session_token: "text not null unique",
  expires_at: "timestamp with time zone not null",
  created_at: "timestamp with time zone default now()",
}

// SQL to create these tables:
export const createTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`

