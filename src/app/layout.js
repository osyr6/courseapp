import { Cairo } from "next/font/google"
import "./globals.css"
import AuthSessionProvider from "@/components/shared/SessionProvider"
import Chatbot from "@/components/shared/Chatbot"

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
})

export const metadata = {
  title: "منصة الدورات التعليمية",
  description: "منصة تعليمية لتسجيل الدورات",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <AuthSessionProvider>
          {children}
          <Chatbot />
        </AuthSessionProvider>
      </body>
    </html>
  )
}