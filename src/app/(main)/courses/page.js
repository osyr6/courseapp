"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">
          منصة الدورات
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            إنشاء حساب
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">الدورات المتاحة</h1>

        {loading ? (
          <div className="text-center text-gray-500 py-20">جاري التحميل...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            لا توجد دورات متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="bg-blue-100 h-40 flex items-center justify-center">
                  <span className="text-blue-400 text-5xl">📚</span>
                </div>
                <div className="p-5">
                  <h2 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {course.price} ر.ع
                    </span>
                    <Link href={`/courses/${course.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                      التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}