"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [centers, setCenters] = useState([])
  const [step, setStep] = useState(1) // Step 1: Phone input, Step 2: Code verification
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    centerId: "",
    verificationCode: ""
  })
  
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch centers on load
  useEffect(() => {
    fetch("/api/centers")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCenters(data)
      })
      .catch(() => setError("فشل في تحميل قائمة المراكز"))
  }, [])

  // Step 1: Send OTP Code to Phone
  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "فشل إرسال رمز التحقق")
        setLoading(false)
        return
      }

      // Move to OTP code entering step
      setStep(2)
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify Code & Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          centerId: formData.centerId || null,
          code: formData.verificationCode
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "رمز التحقق غير صحيح")
        setLoading(false)
        return
      }

      // Success -> Redirect to dashboard or login
      router.push("/dashboard")
    } catch (err) {
      setError("حدث خطأ في الخادم أثناء تأكيد الحساب")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          إنشاء حساب جديد بالرقم
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* STEP 1 FORM: COLLECT INFO & SEND SMS */
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                placeholder="05xxxxxxxx"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المسجد / المركز
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.centerId}
                onChange={(e) => setFormData({ ...formData, centerId: e.target.value })}
              >
                <option value="">اختر المسجد أو المركز</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name} — {center.location}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "جاري الإرسال..." : "أرسل رمز التحقق"}
            </button>
          </form>
        ) : (
          /* STEP 2 FORM: ENTER OTP CODE */
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <p className="text-sm text-center text-gray-600 mb-2">
              تم إرسال رمز تحقق إلى الرقم <span className="font-semibold">{formData.phone}</span>
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                أدخل رمز التحقق (OTP)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="XXXXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "جاري التأكيد..." : "تأكيد الحساب وإنشاء الدخول"}
            </button>

            <button
              type="button"
              className="w-full text-sm text-gray-500 hover:underline text-center block mt-2"
              onClick={() => setStep(1)}
            >
              تعديل رقم الهاتف
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            تسجيل الدخول بالرقم
          </Link>
        </p>
      </div>
    </div>
  )
}