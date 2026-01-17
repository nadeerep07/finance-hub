import { connectDB } from "@/lib/mongodb"
import { Insight } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await connectDB()

    const now = new Date()
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const insights = await Insight.find({
      userId: decoded.userId,
      month: currentMonth,
    }).sort({ createdAt: -1 })

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Insights list error:", error)
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}
