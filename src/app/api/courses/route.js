import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { enrollments: true } }
      }
    })

    return NextResponse.json(courses)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}