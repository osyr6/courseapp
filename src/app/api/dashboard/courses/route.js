import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const courses = await db.course.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { enrollments: true } } }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { title, description, price, seats, startDate, endDate, duration, classDuration } = await request.json()

    const course = await db.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        seats: parseInt(seats) || 0,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        duration: duration || null,
        classDuration: classDuration || null,
        isActive: true
      }
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}