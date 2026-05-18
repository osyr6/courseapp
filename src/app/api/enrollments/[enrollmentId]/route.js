import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const { enrollmentId } = await context.params

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "التسجيل غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json(enrollment)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}