const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function init() {
  try {
    // Create User table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT
      )
    `)

    // Create Watch table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Watch" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        year TEXT NOT NULL,
        description TEXT NOT NULL,
        "imageSrc" TEXT NOT NULL
      )
    `)

    console.log("Database tables created successfully")
  } catch (error) {
    console.error("Error creating tables:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

init()
