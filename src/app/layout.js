import { Cairo } from "next/font/google"
import "./globals.css"
import AuthSessionProvider from "@/components/shared/SessionProvider"
import Chatbot from "@/components/shared/Chatbot"
import Navbar from "@/components/layout/Navbar"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
})

export const metadata = {
  title: "الجمعية العمانية للعناية بالقرآن الكريم - منصة الدورات",
  description: "منصة الجمعية العمانية للعناية بالقرآن الكريم لتسجيل الدورات القرآنية",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <AuthSessionProvider>
          <Navbar />
          {children}
          <Chatbot />
        </AuthSessionProvider>
      </body>
    </html>
  )
}