import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import db from "@/lib/db"

export async function POST(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { enrollmentId } = await context.params

    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        paymentStatus: "paid",
        status: "active"
      }
    })

    return NextResponse.json({ message: "تم تأكيد الدفع" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}