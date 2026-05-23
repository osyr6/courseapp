import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 })
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { course: true }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
