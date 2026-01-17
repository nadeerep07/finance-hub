import { connectDB } from "@/lib/mongodb"
import { Transaction, User } from "@/lib/schemas"
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

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch transactions for the current month
    const transactions = await Transaction.find({
      userId: decoded.userId,
      date: { $gte: startOfMonth },
    })

    const monthlyIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const savings = monthlyIncome - monthlyExpense

    return NextResponse.json({
      monthlyIncome,
      monthlyExpense,
      savings,
      creditUtilization: Math.round(user.creditLimit ? (monthlyExpense / user.creditLimit) * 100 : 0),
      creditScore: user.creditScore,
      incomeChange: 5.2, // Mock for now
      expenseChange: -2.1, // Mock for now
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
