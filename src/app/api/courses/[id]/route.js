import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(request, { params }) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.id }
    })

    if (!course) {
      return NextResponse.json(
        { error: "الدورة غير موجودة" },
        { status: 404 }
      )
    }

    return NextResponse.json(course)

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}