import { neon } from '@neondatabase/serverless'

export async function getUserApiKeys(userId: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  
  const result = await sql`
    SELECT 
      openai_api_key,
      anthropic_api_key,
      google_generative_ai_api_key
    FROM user_login 
    WHERE id = ${userId}
  `
  
  if (!result || result.length === 0) {
    return null;
  }
  
  return {
    openai: result[0].openai_api_key || process.env.OPENAI_API_KEY,
    anthropic: result[0].anthropic_api_key || process.env.ANTHROPIC_API_KEY,
    google: result[0].google_generative_ai_api_key || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  }
}