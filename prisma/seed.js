const { Pool } = require("pg")
const { hash } = require("bcryptjs")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function main() {
  // Seed admin user
  const password = await hash("admin123", 12)
  const adminId = crypto.randomUUID()

  await pool.query(
    'INSERT INTO "User" (id, email, password, name) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
    [adminId, "admin@example.com", password, "Admin"]
  )

  console.log('Seeded admin user: admin@example.com / admin123')

  // Seed original watches
  const watches = [
    {
      id: crypto.randomUUID(),
      name: "Tank",
      brand: "Cartier",
      year: "1917",
      description: "Inspired by the aerial view of Renault tanks during World War I, the Tank is a revolutionary design that broke away from round watch cases. Its clean lines and Roman numeral dial have made it an enduring symbol of understated elegance.",
      imageSrc: "/images/cartier-tank.jpg",
    },
    {
      id: crypto.randomUUID(),
      name: "Crash",
      brand: "Cartier",
      year: "1967",
      description: "Born in Swinging London, the Crash features a deliberately distorted case that appears to have melted in the sun. This surrealist masterpiece challenges conventional watchmaking and remains one of the most avant-garde designs ever created.",
      imageSrc: "/images/cartier-crash.jpg",
    },
    {
      id: crypto.randomUUID(),
      name: "Reverso",
      brand: "Jaeger-LeCoultre",
      year: "1931",
      description: "Originally designed for polo players who needed to protect their watch faces during matches, the Reverso features an ingenious swiveling case. Its Art Deco lines and dual-face capability make it a triumph of form meeting function.",
      imageSrc: "/images/jlc-reverso.jpg",
    },
  ]

  // Clear existing watches and insert fresh
  await pool.query('DELETE FROM "Watch"')
  
  for (const watch of watches) {
    await pool.query(
      'INSERT INTO "Watch" (id, name, brand, year, description, "imageSrc") VALUES ($1, $2, $3, $4, $5, $6)',
      [watch.id, watch.name, watch.brand, watch.year, watch.description, watch.imageSrc]
    )
  }

  console.log('Seeded 3 watches: Tank, Crash, Reverso')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
