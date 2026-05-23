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

    const teachers = await db.teacher.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { courses: true } } }
    })

    return NextResponse.json(teachers)
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    }

    const { name, email, phone, bio } = await request.json()

    const teacher = await db.teacher.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        bio: bio || null,
        isActive: true
      }
    })

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}