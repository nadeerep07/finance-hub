import { connectDB } from "@/lib/mongodb"
import { CreditCard, User, Transaction } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

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

    let creditCard = await CreditCard.findOne({ userId: decoded.userId })
    const user = await User.findById(decoded.userId)

    if (!creditCard && user) {
      // Create default credit card if none exists
      creditCard = await CreditCard.create({
        userId: decoded.userId,
        cardName: "Primary Card",
        creditLimit: user.creditLimit || 10000,
        usedAmount: 0,
      })
    }

    if (!creditCard) {
      return NextResponse.json({ error: "Credit card not found" }, { status: 404 })
    }

    // Calculate current month's credit card expenses
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    console.log("Querying transactions for userId:", decoded.userId)
    console.log("Start of month:", startOfMonth)

    // Convert userId to ObjectId for proper matching
    const userObjectId = new mongoose.Types.ObjectId(decoded.userId)

    const creditExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: userObjectId, // Use ObjectId instead of string
          category: "Credit Card",
          type: "expense",
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])

    console.log("Credit expenses result:", creditExpenses)

    const usedAmount = creditExpenses.length > 0 ? creditExpenses[0].total : 0
    const utilization = creditCard.creditLimit ? Math.round((usedAmount / creditCard.creditLimit) * 100) : 0
    const availableCredit = creditCard.creditLimit - usedAmount

    const response = {
      _id: creditCard._id,
      userId: creditCard.userId,
      cardName: creditCard.cardName,
      creditLimit: creditCard.creditLimit,
      usedAmount,
      utilization,
      availableCredit,
      lastUpdated: creditCard.lastUpdated,
      createdAt: creditCard.createdAt,
      updatedAt: creditCard.updatedAt,
    }

    console.log("Returning response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Credit card fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch credit card" }, { status: 500 })
  }
}