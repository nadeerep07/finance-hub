import { connectDB } from "@/lib/mongodb"
import { User, Transaction } from "@/lib/schemas"
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

    // Fetch last 3 months of transactions
    const now = new Date()
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)

    const transactions = await Transaction.find({
      userId: decoded.userId,
      date: { $gte: threeMonthsAgo },
    })

    const creditExpenses = transactions
      .filter((t) => t.type === "expense" && t.category === "Credit Card")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const creditUtilization = user.creditLimit ? (creditExpenses / user.creditLimit) * 100 : 0
    const spendingPattern = totalExpenses > 0 ? (creditExpenses / totalExpenses) * 100 : 0

    // Simple credit score prediction logic
    let scoreChange = 0

    // Utilization factor (-50 points if > 50%, +5 if < 30%)
    if (creditUtilization > 50) {
      scoreChange -= Math.min(50, creditUtilization - 50)
    } else if (creditUtilization < 30) {
      scoreChange += 5
    }

    // Spending discipline factor
    if (spendingPattern > 70) {
      scoreChange -= 20
    } else if (spendingPattern < 30) {
      scoreChange += 10
    }

    const predictedScore = Math.max(300, Math.min(850, user.creditScore + scoreChange))

    return NextResponse.json({
      currentScore: user.creditScore,
      predictedScore,
      scoreChange,
      creditUtilization: Math.round(creditUtilization),
      factors: {
        utilizationFactor: creditUtilization > 50 ? "High (Negative Impact)" : "Good",
        spendingPattern: spendingPattern > 70 ? "High Credit Spending" : "Balanced",
      },
    })
  } catch (error) {
    console.error("Credit score prediction error:", error)
    return NextResponse.json({ error: "Failed to predict credit score" }, { status: 500 })
  }
}
