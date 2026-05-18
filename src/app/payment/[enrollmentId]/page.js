"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

export default function PaymentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push("/login")
      return
    }
    fetch(`/api/enrollments/${params.enrollmentId}`)
      .then(res => res.json())
      .then(data => {
        setEnrollment(data)
        setLoading(false)
      })
  }, [session, params.enrollmentId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">جاري التحميل...</p>
    </div>
  )

  if (!enrollment) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">التسجيل غير موجود</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">منصة الدورات</Link>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">تفاصيل الدفع</h1>
          <p className="text-gray-500 mb-6">الدورة: {enrollment.course?.title}</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 font-bold text-lg">
              المبلغ المطلوب: {enrollment.course?.price} ر.ع
            </p>
          </div>
          {enrollment.paymentMethod === "cash" && (
            <div className="border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">الدفع نقدا في المركز</h2>
              <p className="text-gray-600 mb-2">يرجى التوجه إلى المركز ودفع المبلغ المطلوب.</p>
              <p className="text-gray-600">سيتم تفعيل تسجيلك بعد تأكيد الدفع من قبل المسؤول.</p>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm font-medium">حالة الدفع: في انتظار التأكيد</p>
              </div>
            </div>
          )}
          {enrollment.paymentMethod === "bank_transfer" && (
            <div className="border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">التحويل البنكي</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">اسم البنك</span>
                  <span className="font-bold text-gray-800">بنك مسقط</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">اسم الحساب</span>
                  <span className="font-bold text-gray-800">مركز الدورات التعليمية</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">رقم الحساب</span>
                  <span className="font-bold text-gray-800">1234567890</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-500">IBAN</span>
                  <span className="font-bold text-gray-800">OM12345678901234567890</span>
                </div>
              </div>
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm font-medium">بعد التحويل، سيتم تفعيل تسجيلك خلال 24 ساعة</p>
              </div>
            </div>
          )}
          {enrollment.paymentMethod === "online" && (
            <div className="border border-gray-200 rounded-xl p-6">
              <h2 className="font-bold text-lg text-gray-800 mb-4">الدفع الالكتروني</h2>
              <p className="text-gray-600 mb-4">سيتم تحويلك إلى بوابة الدفع الآمنة لإتمام عملية الدفع.</p>
              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                الدفع الآن
              </button>
            </div>
          )}
          <Link href="/courses" className="block text-center text-blue-600 mt-6 hover:underline">
            العودة إلى الدورات
          </Link>
        </div>
      </div>
    </div>
  )
}
