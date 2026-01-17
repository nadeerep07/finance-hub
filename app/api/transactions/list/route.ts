import { connectDB } from "@/lib/mongodb"
import { Transaction } from "@/lib/schemas"
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

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const month = searchParams.get("month")

    const query: any = { userId: decoded.userId }

    if (type) query.type = type
    if (category) query.category = category

    if (month) {
      const date = new Date(month)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      query.date = { $gte: startOfMonth, $lte: endOfMonth }
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).limit(100)

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Transaction list error:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
