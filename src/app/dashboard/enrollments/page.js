"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardEnrollmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/")
    if (status === "authenticated" && session?.user?.role === "admin") loadEnrollments()
  }, [session, status])

  const loadEnrollments = async () => {
    const res = await fetch("/api/dashboard/enrollments")
    const data = await res.json()
    setEnrollments(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const confirmPayment = async (enrollmentId) => {
    const res = await fetch(`/api/dashboard/enrollments/${enrollmentId}/confirm`, {
      method: "POST"
    })
    if (res.ok) {
      setMessage("تم تأكيد الدفع بنجاح")
      loadEnrollments()
    }
  }

  const rejectEnrollment = async (enrollmentId) => {
    if (!confirm("هل أنت متأكد من رفض هذا التسجيل؟")) return
    const res = await fetch(`/api/dashboard/enrollments/${enrollmentId}/reject`, {
      method: "POST"
    })
    if (res.ok) {
      setMessage("تم رفض التسجيل")
      loadEnrollments()
    }
  }

  const filtered = enrollments.filter(e => {
    if (filter === "all") return true
    if (filter === "unpaid") return e.paymentStatus === "unpaid"
    if (filter === "paid") return e.paymentStatus === "paid"
    if (filter === "rejected") return e.status === "rejected"
    return true
  })

  const getPaymentMethodLabel = (method) => {
    if (method === "cash") return "نقداً"
    if (method === "bank_transfer") return "تحويل بنكي"
    if (method === "online") return "دفع إلكتروني"
    return method
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600">إدارة التسجيلات</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">العودة للوحة التحكم</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-center">{message}</div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "الكل" },
            { key: "unpaid", label: "في انتظار الدفع" },
            { key: "paid", label: "مدفوع" },
            { key: "rejected", label: "مرفوض" }
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === tab.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">لا توجد تسجيلات</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(enrollment => (
              <div key={enrollment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800">{enrollment.user?.name}</h3>
                      <span className="text-gray-400">—</span>
                      <span className="text-blue-600 font-medium">{enrollment.course?.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>البريد: {enrollment.user?.email}</span>
                      <span>طريقة الدفع: {getPaymentMethodLabel(enrollment.paymentMethod)}</span>
                      <span>السعر: {enrollment.course?.price} ر.ع</span>
                      <span>تاريخ التسجيل: {new Date(enrollment.createdAt).toLocaleDateString("ar-OM")}</span>
                      {enrollment.user?.center && (
                        <span>المركز: {enrollment.user.center.name}</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        enrollment.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                        enrollment.status === "rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {enrollment.paymentStatus === "paid" ? "✅ مدفوع" :
                         enrollment.status === "rejected" ? "❌ مرفوض" :
                         "⏳ في انتظار الدفع"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mr-4">
                    {enrollment.paymentStatus !== "paid" && enrollment.status !== "rejected" && (
                      <>
                        <button onClick={() => confirmPayment(enrollment.id)}
                          className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-100 transition text-sm">
                          تأكيد الدفع
                        </button>
                        <button onClick={() => rejectEnrollment(enrollment.id)}
                          className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition text-sm">
                          رفض
                        </button>
                      </>
                    )}
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