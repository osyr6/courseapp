"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function MyEnrollmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      fetch("/api/my-enrollments")
        .then(res => res.json())
        .then(data => {
          setEnrollments(Array.isArray(data) ? data : [])
          setLoading(false)
        })
    }
  }, [status])

  const getStatusLabel = (enrollment) => {
    if (enrollment.paymentStatus === "paid") return { label: "✅ مفعّل", color: "bg-green-100 text-green-700" }
    if (enrollment.status === "rejected") return { label: "❌ مرفوض", color: "bg-red-100 text-red-700" }
    return { label: "⏳ في انتظار تأكيد الدفع", color: "bg-yellow-100 text-yellow-700" }
  }

  const getPaymentMethodLabel = (method) => {
    if (method === "cash") return "نقداً في المركز"
    if (method === "bank_transfer") return "تحويل بنكي"
    if (method === "online") return "دفع إلكتروني"
    return method
  }

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">جاري التحميل...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">منصة الدورات</Link>
        <Link href="/courses" className="text-gray-600 hover:text-blue-600">الدورات</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">دوراتي المسجلة</h1>

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">لم تسجل في أي دورة بعد</p>
            <Link href="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              تصفح الدورات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map(enrollment => {
              const statusInfo = getStatusLabel(enrollment)
              return (
                <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{enrollment.course?.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{enrollment.course?.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span>السعر: {enrollment.course?.price} ر.ع</span>
                        <span>طريقة الدفع: {getPaymentMethodLabel(enrollment.paymentMethod)}</span>
                        <span>تاريخ التسجيل: {new Date(enrollment.createdAt).toLocaleDateString("ar-OM")}</span>
                        {enrollment.course?.startDate && (
                          <span>بداية الدورة: {new Date(enrollment.course.startDate).toLocaleDateString("ar-OM")}</span>
                        )}
                        {enrollment.course?.duration && (
                          <span>المدة: {enrollment.course.duration}</span>
                        )}
                        {enrollment.course?.classDuration && (
                          <span>مدة الحصة: {enrollment.course.classDuration}</span>
                        )}
                      </div>
                      <div className="mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  {enrollment.paymentStatus !== "paid" && enrollment.status !== "rejected" && (
                    <div className="mt-4 border-t border-gray-50 pt-4">
                      <Link href={`/payment/${enrollment.id}`}
                        className="text-blue-600 text-sm hover:underline">
                        عرض تفاصيل الدفع ←
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}