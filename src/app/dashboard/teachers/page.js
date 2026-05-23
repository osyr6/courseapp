"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardTeachersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editTeacher, setEditTeacher] = useState(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", bio: "" })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/")
    if (status === "authenticated" && session?.user?.role === "admin") loadTeachers()
  }, [session, status])

  const loadTeachers = async () => {
    const res = await fetch("/api/dashboard/teachers")
    const data = await res.json()
    setTeachers(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editTeacher ? `/api/dashboard/teachers/${editTeacher.id}` : "/api/dashboard/teachers"
    const method = editTeacher ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setMessage(editTeacher ? "تم تعديل المعلم بنجاح" : "تم إضافة المعلم بنجاح")
      setShowForm(false)
      setEditTeacher(null)
      setFormData({ name: "", email: "", phone: "", bio: "" })
      loadTeachers()
    }
  }

  const handleEdit = (teacher) => {
    setEditTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email || "",
      phone: teacher.phone || "",
      bio: teacher.bio || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعلم؟")) return
    const res = await fetch(`/api/dashboard/teachers/${id}`, { method: "DELETE" })
    if (res.ok) { setMessage("تم حذف المعلم بنجاح"); loadTeachers() }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl" style={{ color: "#8B1A1A" }}>إدارة المعلمين</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-red-800">العودة للوحة التحكم</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-center">{message}</div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">المعلمين ({teachers.length})</h2>
          <button onClick={() => { setShowForm(true); setEditTeacher(null); setFormData({ name: "", email: "", phone: "", bio: "" }) }}
            className="text-white px-4 py-2 rounded-xl transition" style={{ backgroundColor: "#8B1A1A" }}>
            + إضافة معلم
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">{editTeacher ? "تعديل المعلم" : "إضافة معلم جديد"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم المعلم</label>
                  <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نبذة عن المعلم</label>
                <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2"
                  value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="text-white px-6 py-2 rounded-xl transition" style={{ backgroundColor: "#8B1A1A" }}>
                  {editTeacher ? "حفظ التعديلات" : "إضافة المعلم"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditTeacher(null) }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition">إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="space-y-4">
            {teachers.map(teacher => (
              <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">👨‍🏫 {teacher.name}</h3>
                  {teacher.email && <p className="text-gray-500 text-sm mt-1">📧 {teacher.email}</p>}
                  {teacher.phone && <p className="text-gray-500 text-sm">📞 {teacher.phone}</p>}
                  {teacher.bio && <p className="text-gray-400 text-sm mt-1">{teacher.bio}</p>}
                  <p className="text-sm mt-1" style={{ color: "#8B1A1A" }}>
                    عدد الدورات: {teacher._count?.courses || 0}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(teacher)}
                    className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-xl hover:bg-yellow-100 transition">تعديل</button>
                  <button onClick={() => handleDelete(teacher.id)}
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