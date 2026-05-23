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
    const { name, location } = await request.json()

    const center = await db.center.update({
      where: { id },
      data: { name, location: location || null }
    })

    return NextResponse.json(center)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { id } = await context.params
    await db.center.delete({ where: { id } })

    return NextResponse.json({ message: "تم الحذف" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}