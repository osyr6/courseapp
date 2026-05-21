import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function PUT(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { title, description, price, seats } = body

    const course = await db.course.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        seats: parseInt(seats) || 0
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("PUT ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { id } = await context.params
    await db.course.delete({ where: { id } })

    return NextResponse.json({ message: "تم الحذف" })
  } catch (error) {
    console.error("DELETE ERROR:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}