"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingPayments: 0
  })

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
      return
    }
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetch("/api/dashboard/stats")
        .then(res => res.json())
        .then(data => setStats(data))
    }
  }, [session, status, router])

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">جاري التحميل...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600">لوحة التحكم</h1>
        <div className="flex gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            الموقع الرئيسي
          </Link>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{session?.user?.name}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">الطلاب</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">الدورات</p>
            <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">التسجيلات</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalEnrollments}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">دفعات معلقة</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingPayments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/courses" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-bold text-gray-800">إدارة الدورات</h3>
            <p className="text-gray-500 text-sm mt-1">إضافة وتعديل وحذف الدورات</p>
          </Link>
          <Link href="/dashboard/students" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="font-bold text-gray-800">إدارة الطلاب</h3>
            <p className="text-gray-500 text-sm mt-1">عرض وإدارة جميع الطلاب</p>
          </Link>
          <Link href="/dashboard/enrollments" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-gray-800">التسجيلات</h3>
            <p className="text-gray-500 text-sm mt-1">عرض وتأكيد التسجيلات</p>
          </Link>
          <Link href="/dashboard/stats" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
          <div className="text-4xl mb-3">📊</div>
           <h3 className="font-bold text-gray-800">الإحصائيات</h3>
          <p className="text-gray-500 text-sm mt-1">تقارير وإحصائيات مفصلة</p>
           </Link>
          
          <Link href="/dashboard/centers" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center">
            <div className="text-4xl mb-3">🕌</div>
            <h3 className="font-bold text-gray-800">المساجد والمراكز</h3>
            <p className="text-gray-500 text-sm mt-1">إدارة المساجد والمراكز</p>
          </Link>
        </div>
      </div>
    </div>
  )
}