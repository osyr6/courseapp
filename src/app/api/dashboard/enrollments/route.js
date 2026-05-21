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

    const enrollments = await db.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: { center: true }
        },
        course: true
      }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}