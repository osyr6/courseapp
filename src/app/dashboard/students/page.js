"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardStudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCenter, setFilterCenter] = useState("all")
  const [centers, setCenters] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated" && session?.user?.role !== "admin") router.push("/")
    if (status === "authenticated" && session?.user?.role === "admin") {
      loadStudents()
      loadCenters()
    }
  }, [session, status])

  const loadStudents = async () => {
    const res = await fetch("/api/dashboard/students")
    const data = await res.json()
    setStudents(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  const loadCenters = async () => {
    const res = await fetch("/api/centers")
    const data = await res.json()
    setCenters(Array.isArray(data) ? data : [])
  }

  const filtered = students.filter(s => {
    const matchSearch = s.name.includes(search) || s.email.includes(search)
    const matchCenter = filterCenter === "all" || s.centerId === filterCenter
    return matchSearch && matchCenter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-blue-600">إدارة الطلاب</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">العودة للوحة التحكم</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="ابحث باسم الطالب أو البريد الإلكتروني"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterCenter}
            onChange={(e) => setFilterCenter(e.target.value)}
          >
            <option value="all">جميع المراكز</option>
            {centers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          الطلاب ({filtered.length})
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-10">لا يوجد طلاب</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">الاسم</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">البريد الإلكتروني</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">المركز</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">التسجيلات</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-gray-600">تاريخ الانضمام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{student.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {student.center?.name || "غير محدد"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                        {student._count?.enrollments || 0} دورة
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(student.createdAt).toLocaleDateString("ar-OM")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}