import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const { courseId, paymentMethod } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { error: "معرف الدورة مطلوب" },
        { status: 400 }
      )
    }

    const existing = await db.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "أنت مسجل في هذه الدورة بالفعل" },
        { status: 400 }
      )
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod
      }
    })

    return NextResponse.json(
        { 
          message: "تم التسجيل بنجاح", 
          enrollment,
          paymentUrl: `/payment/${enrollment.id}`
        },
        { status: 201 }
      )

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}