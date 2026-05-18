import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const centers = await db.center.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    })
    return NextResponse.json(centers)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}