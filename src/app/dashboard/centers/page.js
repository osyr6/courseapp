"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardCentersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCenter, setEditCenter] = useState(null)
  const [formData, setFormData] = useState({ name: "", location: "" })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/")
    if (status === "authenticated" && session?.user?.role === "admin") loadCenters()
  }, [session, status])

  const loadCenters = async () => {
    const res = await fetch("/api/dashboard/centers")
    const data = await res.json()
    setCenters(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editCenter ? `/api/dashboard/centers/${editCenter.id}` : "/api/dashboard/centers"
    const method = editCenter ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setMessage(editCenter ? "تم تعديل المركز بنجاح" : "تم إضافة المركز بنجاح")
      setShowForm(false)
      setEditCenter(null)
      setFormData({ name: "", location: "" })
      loadCenters()
    }
  }

  const handleEdit = (center) => {
    setEditCenter(center)
    setFormData({ name: center.name, location: center.location || "" })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المركز؟")) return
    const res = await fetch(`/api/dashboard/centers/${id}`, { method: "DELETE" })
    if (res.ok) { setMessage("تم حذف المركز بنجاح"); loadCenters() }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600">إدارة المساجد والمراكز</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">العودة للوحة التحكم</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-center">{message}</div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">المراكز ({centers.length})</h2>
          <button onClick={() => { setShowForm(true); setEditCenter(null); setFormData({ name: "", location: "" }) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            + إضافة مركز
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">{editCenter ? "تعديل المركز" : "إضافة مركز جديد"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المسجد / المركز</label>
                <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموقع / المنطقة</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: مسقط، صلالة، صحار"
                  value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
                  {editCenter ? "حفظ التعديلات" : "إضافة المركز"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditCenter(null) }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition">إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="space-y-4">
            {centers.map(center => (
              <div key={center.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">🕌 {center.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{center.location}</p>
                  <p className="text-gray-400 text-sm mt-1">عدد الطلاب: {center._count?.users || 0}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(center)}
                    className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-xl hover:bg-yellow-100 transition">تعديل</button>
                  <button onClick={() => handleDelete(center.id)}
                    className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition">حذف</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
