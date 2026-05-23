"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 shadow-md" style={{ background: "linear-gradient(135deg, #8B1A1A, #6B1010)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-lg text-white leading-tight">
          <span className="block text-sm text-yellow-300">الجمعية العمانية للعناية بالقرآن الكريم</span>
          <span className="block text-base">منصة الدورات</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-white hover:text-yellow-300 font-medium transition">
            الدورات
          </Link>
          
          {session ? (
            <>
              <Link href="/my-enrollments" className="text-white hover:text-yellow-300 font-medium transition">
                دوراتي
              </Link>
              {session.user.role === "admin" && (
                <Link href="/dashboard" className="text-white hover:text-yellow-300 font-medium transition">
                  لوحة التحكم
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="text-yellow-200 text-sm">أهلاً، {session.user.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-white text-red-800 px-4 py-2 rounded-xl text-sm hover:bg-yellow-100 transition font-medium"
                >
                  خروج
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-white hover:text-yellow-300 font-medium transition">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition font-medium">
                إنشاء حساب
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-red-900 px-4 py-4 space-y-3" style={{ background: "#6B1010" }}>
          <Link href="/courses" onClick={() => setMenuOpen(false)}
            className="block text-white hover:text-yellow-300 font-medium py-2">
            الدورات
          </Link>
          {session ? (
            <>
              <Link href="/my-enrollments" onClick={() => setMenuOpen(false)}
                className="block text-white hover:text-yellow-300 font-medium py-2">
                دوراتي
              </Link>
              {session.user.role === "admin" && (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="block text-white hover:text-yellow-300 font-medium py-2">
                  لوحة التحكم
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-right text-yellow-300 font-medium py-2"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block text-white hover:text-yellow-300 font-medium py-2">
                تسجيل الدخول
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="block text-yellow-300 font-medium py-2">
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}