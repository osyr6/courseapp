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
        setCourses(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen" style={{ background: "#f8f5f0" }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#8B1A1A" }}>الدورات المتاحة</h1>
        <p className="text-gray-500 mb-8">اختر دورتك وابدأ رحلتك مع القرآن الكريم</p>

        {loading ? (
          <div className="text-center text-gray-500 py-20">جاري التحميل...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-500 py-20">لا توجد دورات متاحة حالياً</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const enrolled = course._count?.enrollments || 0
              const remaining = course.seats - enrolled
              const isFull = remaining <= 0
              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden hover:shadow-md transition">
                  <div className="h-40 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B1A1A, #6B1010)" }}>
                    <span className="text-white text-5xl">📖</span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h2>
                    <p className="text-gray-500 text-sm mb-3">{course.description}</p>
                    <div className="space-y-1 mb-4">
                      {course.startDate && (
                        <p className="text-gray-400 text-xs">📅 البداية: {new Date(course.startDate).toLocaleDateString("ar-OM")}</p>
                      )}
                      {course.duration && (
                        <p className="text-gray-400 text-xs">⏱ المدة: {course.duration}</p>
                      )}
                      {course.classDuration && (
                        <p className="text-gray-400 text-xs">🕐 مدة الحصة: {course.classDuration}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg" style={{ color: "#8B1A1A" }}>{course.price} ر.ع</span>
                        <div className={`text-xs mt-1 font-medium ${isFull ? "text-red-500" : "text-green-600"}`}>
                          {isFull ? "🔴 المقاعد ممتلئة" : `🟢 ${remaining} مقعد متبقي`}
                        </div>
                      </div>
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-white px-4 py-2 rounded-xl text-sm transition hover:opacity-90"
                        style={{ backgroundColor: isFull ? "#999" : "#8B1A1A" }}
                      >
                        {isFull ? "مكتمل" : "التفاصيل"}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
