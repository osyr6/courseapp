"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function CourseDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")

  useEffect(() => {
    fetch(`/api/courses/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data)
        setLoading(false)
      })
  }, [params.id])

  const handleEnroll = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    setEnrolling(true)
    setMessage("")

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: params.id,
          paymentMethod
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error)
    } else {
        router.push(data.paymentUrl)
      }
    } catch (error) {
      setMessage("حدث خطأ في الخادم")
    }

    setEnrolling(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">جاري التحميل...</p>
    </div>
  )

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">الدورة غير موجودة</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">منصة الدورات</Link>
        <Link href="/courses" className="text-gray-600 hover:text-blue-600">
          العودة للدورات
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-100 h-48 flex items-center justify-center">
            <span className="text-blue-400 text-7xl">📚</span>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
            <p className="text-gray-600 text-lg mb-6">{course.description}</p>

            <div className="flex items-center justify-between mb-8">
              <span className="text-2xl font-bold text-blue-600">{course.price} ر.ع</span>
            </div>

            {session && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3">طريقة الدفع</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "cash", label: "نقداً في المركز" },
                    { value: "bank_transfer", label: "تحويل بنكي" },
                    { value: "online", label: "دفع إلكتروني" }
                  ].map(method => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                        paymentMethod === method.value
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl mb-4 text-center font-medium ${
                message.includes("نجاح") || message.includes("بنجاح")
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}>
                {message}
              </div>
            )}

            {session ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {enrolling ? "جاري التسجيل..." : "التسجيل في الدورة"}
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition text-center"
              >
                سجّل دخولك للتسجيل في الدورة
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}