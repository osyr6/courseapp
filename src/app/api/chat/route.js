import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import db from "@/lib/db"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

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

    const systemPrompt = `أنت مساعد ذكي لمنصة الدورات التعليمية في سلطنة عُمان.
    
الدورات المتاحة حالياً:
${coursesText}

المساجد والمراكز المتاحة:
${centersText}

طرق الدفع المتاحة:
- نقداً في المركز
- تحويل بنكي
- دفع إلكتروني

مهمتك مساعدة الطلاب في:
- الإجابة على أسئلتهم عن الدورات المتاحة
- مساعدتهم في عملية التسجيل
- الإجابة على الأسئلة العامة عن المنصة
- توجيههم لطرق الدفع المتاحة

تحدث دائماً باللغة العربية الفصحى المهذية فقط ولا تستخدم أي لغة أخرى أبداً حتى لو سألك المستخدم بلغة أخرى.
يجب أن تكون جميع ردودك باللغة العربية فقط بدون أي كلمات أجنبية.
اذا سالك احد سؤال خارج موضوع الموقع او سؤال خادشا فاعتذر عن الاجابة
 
لاتكتب كلمات بالصينية عن طريق الخطا
لاتعرض على المستخدم التحدث كثيرا حاول ان تكون اجاباتك رسمية 
وابتعد عن الاجابات الطويلة جدا عند الحصول على اجابة قصيرةاو دردشة خارج نطاق الاسئلة 
إذا سألك أحد عن شيء خارج نطاق المنصة، وجّهه برفق للتواصل مع الإدارة.`

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      }))
    ]

    const completion = await groq.chat.completions.create({
      messages: chatMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024
    })

    const text = completion.choices[0]?.message?.content || "عذراً، لم أتمكن من الإجابة."

    return NextResponse.json({ message: text })

  } catch (error) {
    console.error("CHAT ERROR:", error.message)
    return NextResponse.json(
      { error: error.message || "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}