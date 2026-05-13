const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  // Seed admin user
  const password = await hash("admin123", 12)

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password,
      name: "Admin",
    },
  })

  console.log('Seeded admin user: admin@example.com / admin123')

  // Seed original watches
  const watches = [
    {
      name: "Tank",
      brand: "Cartier",
      year: "1917",
      description: "Inspired by the aerial view of Renault tanks during World War I, the Tank is a revolutionary design that broke away from round watch cases. Its clean lines and Roman numeral dial have made it an enduring symbol of understated elegance.",
      imageSrc: "/images/cartier-tank.jpg",
    },
    {
      name: "Crash",
      brand: "Cartier",
      year: "1967",
      description: "Born in Swinging London, the Crash features a deliberately distorted case that appears to have melted in the sun. This surrealist masterpiece challenges conventional watchmaking and remains one of the most avant-garde designs ever created.",
      imageSrc: "/images/cartier-crash.jpg",
    },
    {
      name: "Reverso",
      brand: "Jaeger-LeCoultre",
      year: "1931",
      description: "Originally designed for polo players who needed to protect their watch faces during matches, the Reverso features an ingenious swiveling case. Its Art Deco lines and dual-face capability make it a triumph of form meeting function.",
      imageSrc: "/images/jlc-reverso.jpg",
    },
  ]

  // Clear existing watches and create fresh
  await prisma.watch.deleteMany()
  await prisma.watch.createMany({
    data: watches,
  })

  console.log('Seeded 3 watches: Tank, Crash, Reverso')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
