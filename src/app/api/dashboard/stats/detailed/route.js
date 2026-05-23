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

    const [
      totalStudents,
      totalEnrollments,
      paidEnrollments,
      courses,
      centers,
      enrollments
    ] = await Promise.all([
      db.user.count({ where: { role: "student" } }),
      db.enrollment.count(),
      db.enrollment.count({ where: { paymentStatus: "paid" } }),
      db.course.findMany({
        include: { _count: { select: { enrollments: true } } }
      }),
      db.center.findMany({
        include: { _count: { select: { users: true } } }
      }),
      db.enrollment.findMany({
        where: { paymentStatus: "paid" },
        include: { course: true }
      })
    ])

    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.course?.price || 0), 0)

    const enrollmentsPerCourse = courses.map(c => ({
      name: c.title.substring(0, 15) + "...",
      count: c._count.enrollments
    }))

    const studentsPerCenter = centers.map(c => ({
      name: c.name,
      count: c._count.users
    }))

    const paymentMethodCounts = { cash: 0, bank_transfer: 0, online: 0 }
    enrollments.forEach(e => {
      if (e.paymentMethod) paymentMethodCounts[e.paymentMethod]++
    })

    const paymentMethods = [
      { name: "نقداً", count: paymentMethodCounts.cash },
      { name: "تحويل بنكي", count: paymentMethodCounts.bank_transfer },
      { name: "إلكتروني", count: paymentMethodCounts.online }
    ]

    return NextResponse.json({
      totalStudents,
      totalEnrollments,
      paidEnrollments,
      totalRevenue,
      enrollmentsPerCourse,
      studentsPerCenter,
      paymentMethods
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 })
  }
}
