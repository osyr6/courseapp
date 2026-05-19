import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import db from "@/lib/db"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { messages } = await request.json()

    const courses = await db.course.findMany({
      where: { isActive: true }
    })

    const centers = await db.center.findMany({
      where: { isActive: true }
    })

    const coursesText = courses.map(c => 
      `- ${c.title}: ${c.description} (السعر: ${c.price} ر.ع)`
    ).join("\n")

    const centersText = centers.map(c => 
      `- ${c.name} في ${c.location}`
    ).join("\n")

    const SYSTEM_PROMPT = `أنت مساعد ذكي لمنصة الدورات التعليمية في سلطنة عُمان.
    
الدورات المتاحة حالياً:
${coursesText}

المساجد والمراكز المتاحة:
${centersText}

طرق الدفع المتاحة:
- نقداً في المركز
- تحويل بنكي
- دفع إلكتروني

تحدث دائماً باللغة العربية وكن مهذباً ومفيداً.`

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-lite",
      systemInstruction: SYSTEM_PROMPT
    })

    // Build full conversation as a single prompt
    const conversationText = messages.map(msg => 
      msg.role === "user" ? `المستخدم: ${msg.content}` : `المساعد: ${msg.content}`
    ).join("\n")

    const result = await model.generateContent(conversationText)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}