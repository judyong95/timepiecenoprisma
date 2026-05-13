import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"
import { auth } from "@/lib/auth"
import { z } from "zod"

const watchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  description: z.string().min(1, "Description is required"),
  imageSrc: z.string().url("Image URL must be valid"),
})

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await context.params
    const body = await req.json()
    const validatedData = watchSchema.parse(body)

    const result = await pool.query(
      'UPDATE "Watch" SET name = $1, brand = $2, year = $3, description = $4, "imageSrc" = $5 WHERE id = $6 RETURNING *',
      [validatedData.name, validatedData.brand, validatedData.year, validatedData.description, validatedData.imageSrc, id]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data", errors: error.errors }, { status: 400 })
    }
    console.error("Error updating watch:", error)
    return NextResponse.json({ message: "Failed to update watch" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await context.params
    await pool.query('DELETE FROM "Watch" WHERE id = $1', [id])

    return NextResponse.json({ message: "Watch deleted successfully" })
  } catch (error) {
    console.error("Error deleting watch:", error)
    return NextResponse.json({ message: "Failed to delete watch" }, { status: 500 })
  }
}
