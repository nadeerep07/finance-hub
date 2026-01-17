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
    const months = Number.parseInt(searchParams.get("months") || "6")

    // Get last N months of data
    const transactions = await Transaction.find({
      userId: decoded.userId,
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - months + 1, 1),
      },
    }).sort({ date: 1 })

    // Organize by month
    const monthlyData: Record<string, { income: number; expense: number; date: Date }> = {}

    transactions.forEach((t) => {
      const monthKey = new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, date: t.date }
      }
      if (t.type === "income") {
        monthlyData[monthKey].income += t.amount
      } else {
        monthlyData[monthKey].expense += t.amount
      }
    })

    // Get category breakdown for current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const categoryData = await Transaction.aggregate([
      {
        $match: {
          userId: decoded.userId,
          type: "expense",
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
    ])

    return NextResponse.json({
      monthlyTrend: Object.entries(monthlyData).map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        date: data.date,
      })),
      categoryBreakdown: categoryData,
    })
  } catch (error) {
    console.error("Analytics data error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
