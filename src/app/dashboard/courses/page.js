"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", seats: "",
    startDate: "", endDate: "", duration: ""
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/")
    if (status === "authenticated" && session?.user?.role === "admin") loadCourses()
  }, [session, status])

  const loadCourses = async () => {
    const res = await fetch("/api/dashboard/courses")
    const data = await res.json()
    setCourses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editCourse ? `/api/dashboard/courses/${editCourse.id}` : "/api/dashboard/courses"
    const method = editCourse ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        seats: parseInt(formData.seats) || 0,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        duration: formData.duration || null
      })
    })
    if (res.ok) {
      setMessage(editCourse ? "تم تعديل الدورة بنجاح" : "تم إضافة الدورة بنجاح")
      setShowForm(false)
      setEditCourse(null)
      setFormData({ title: "", description: "", price: "", seats: "", startDate: "", endDate: "", duration: "" })
      loadCourses()
    }
  }

  const handleEdit = (course) => {
    setEditCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      seats: (course.seats || 0).toString(),
      startDate: course.startDate ? course.startDate.split("T")[0] : "",
      endDate: course.endDate ? course.endDate.split("T")[0] : "",
      duration: course.duration || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    const res = await fetch(`/api/dashboard/courses/${id}`, { method: "DELETE" })
    if (res.ok) { setMessage("تم حذف الدورة بنجاح"); loadCourses() }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600">إدارة الدورات</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">العودة للوحة التحكم</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-center">{message}</div>
        )}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">الدورات ({courses.length})</h2>
          <button onClick={() => { setShowForm(true); setEditCourse(null); setFormData({ title: "", description: "", price: "", seats: "", startDate: "", endDate: "", duration: "" }) }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            + إضافة دورة
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">{editCourse ? "تعديل الدورة" : "إضافة دورة جديدة"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الدورة</label>
                <input type="text" required className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea required rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ر.ع)</label>
                  <input type="number" required step="0.1" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عدد المقاعد</label>
                  <input type="number" required min="1" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
                  <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">مدة الدورة (مثال: 3 أشهر)</label>
                <input type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 3 أشهر، 10 أسابيع"
                  value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
                  {editCourse ? "حفظ التعديلات" : "إضافة الدورة"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditCourse(null) }}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-200 transition">إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : (
          <div className="space-y-4">
            {courses.map(course => {
              const enrolled = course._count?.enrollments || 0
              const remaining = course.seats - enrolled
              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg">{course.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{course.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-blue-600 font-bold">{course.price} ر.ع</span>
                        <span className="text-gray-500 text-sm">
                          المقاعد: {enrolled}/{course.seats}
                          <span className={`mr-1 font-bold ${remaining <= 0 ? "text-red-500" : "text-green-600"}`}>
                            ({remaining <= 0 ? "مكتمل" : `${remaining} متبقي`})
                          </span>
                        </span>
                        {course.startDate && (
                          <span className="text-gray-500 text-sm">
                            البداية: {new Date(course.startDate).toLocaleDateString("ar-OM")}
                          </span>
                        )}
                        {course.endDate && (
                          <span className="text-gray-500 text-sm">
                            النهاية: {new Date(course.endDate).toLocaleDateString("ar-OM")}
                          </span>
                        )}
                        {course.duration && (
                          <span className="text-gray-500 text-sm">المدة: {course.duration}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 mr-4">
                      <button onClick={() => handleEdit(course)}
                        className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-xl hover:bg-yellow-100 transition">
                        تعديل
                      </button>
                      <button onClick={() => handleDelete(course.id)}
                        className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-100 transition">
                        حذف
                      </button>
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