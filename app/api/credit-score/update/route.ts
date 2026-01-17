import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/schemas"
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

    const { creditScore } = await request.json()

    if (!creditScore || creditScore < 300 || creditScore > 850) {
      return NextResponse.json({ error: "Credit score must be between 300 and 850" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findByIdAndUpdate(decoded.userId, { creditScore }, { new: true })

    return NextResponse.json({
      creditScore: user.creditScore,
      message: "Credit score updated successfully",
    })
  } catch (error) {
    console.error("Credit score update error:", error)
    return NextResponse.json({ error: "Failed to update credit score" }, { status: 500 })
  }
}
