import { Pool } from '@neondatabase/serverless'

let pool: Pool | null = null

export function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!pool) {
    pool = new Pool({ connectionString: url })
  }
  return pool
}
