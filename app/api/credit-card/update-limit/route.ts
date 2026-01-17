import { connectDB } from "@/lib/mongodb"
import { CreditCard, User } from "@/lib/schemas"
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

    const { creditLimit } = await request.json()

    if (!creditLimit || creditLimit < 0) {
      return NextResponse.json({ error: "Invalid credit limit" }, { status: 400 })
    }

    await connectDB()

    // Update both user and credit card
    await User.findByIdAndUpdate(decoded.userId, { creditLimit })
    const creditCard = await CreditCard.findOneAndUpdate({ userId: decoded.userId }, { creditLimit }, { new: true })

    return NextResponse.json(creditCard)
  } catch (error) {
    console.error("Credit card update error:", error)
    return NextResponse.json({ error: "Failed to update credit card" }, { status: 500 })
  }
}
