import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-600">منصة الدورات</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center py-20 px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ابدأ رحلتك التعليمية اليوم
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          اكتشف دوراتنا التعليمية وسجّل الآن
        </p>
        <Link href="/courses" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition">
          تصفح الدورات
        </Link>
      </div>
    </div>
  )
}