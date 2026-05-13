import { Hero } from "@/components/hero"
import { WatchCard } from "@/components/watch-card"
import { Footer } from "@/components/footer"
import { pool } from "@/lib/db"

// Force dynamic rendering to skip static generation at build time
export const dynamic = 'force-dynamic'

export default async function WatchShowcase() {
  const result = await pool.query('SELECT * FROM "Watch" ORDER BY name')
  const watches = result.rows

  return (
    <main className="min-h-screen">
      <Hero />
      
      <section className="px-6 lg:px-16 xl:px-24">
        {watches.length === 0 ? (
          <p className="text-muted-foreground py-12">No watches to display yet.</p>
        ) : (
          watches.map((watch, index) => (
            <WatchCard
              key={watch.id}
              index={index + 1}
              name={watch.name}
              brand={watch.brand}
              year={watch.year}
              description={watch.description}
              imageSrc={watch.imageSrc}
            />
          ))
        )}
      </section>
      
      <Footer />
    </main>
  )
}
