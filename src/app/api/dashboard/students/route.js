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

    const students = await db.user.findMany({
      where: { role: "student" },
      orderBy: { createdAt: "desc" },
      include: {
        center: true,
        _count: { select: { enrollments: true } }
      }
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}