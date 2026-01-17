import { connectDB } from "@/lib/mongodb"
import { Transaction, User } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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

    const { type, category, amount, description, date } = await request.json()

    if (!type || !category || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const transaction = await Transaction.create({
      userId: decoded.userId,
      type,
      category,
      amount,
      description: description || "",
      date: date ? new Date(date) : new Date(),
    })

    // Update user credit limit if expense
    if (type === "expense") {
      await User.findByIdAndUpdate(decoded.userId, {
        $inc: { monthlyExpense: amount },
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transaction create error:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
