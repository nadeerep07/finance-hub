import { Groq } from "groq-sdk"
import { connectDB } from "@/lib/mongodb"
import { User, Transaction, Insight } from "@/lib/schemas"
import { verifyToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

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

    await connectDB()

    const user = await User.findById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch current month's transactions
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const transactions = await Transaction.find({
      userId: decoded.userId,
      date: { $gte: startOfMonth },
    })

    const monthlyIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        },
        {} as Record<string, number>,
      )

    const creditUtilization = user.creditLimit ? Math.round((monthlyExpense / user.creditLimit) * 100) : 0

    // Generate insights using Groq
    const insightPrompt = `You are a friendly financial advisor. Based on the following financial data, provide 3-4 concise, actionable financial insights and tips:

Monthly Income: ₹${monthlyIncome.toFixed(2)}
Monthly Expenses: ₹${monthlyExpense.toFixed(2)}
Credit Score: ${user.creditScore}
Credit Utilization: ${creditUtilization}%
Credit Limit: ₹${user.creditLimit}
Expenses by Category: ${JSON.stringify(expensesByCategory)}

Provide practical, specific recommendations to improve their financial health. Focus on:
1. Spending patterns and areas to reduce
2. Credit score improvement strategies
3. Savings opportunities
4. Budget optimization tips

Keep each insight to 1-2 sentences. Be encouraging and supportive.`

const completion = await groq.chat.completions.create({
 model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content:
        "You are a friendly and practical financial advisor. Give concise, actionable insights.",
    },
    {
      role: "user",
      content: insightPrompt,
    },
  ],
  max_tokens: 512,
  temperature: 0.7,
})

const insightContent =
  completion.choices[0]?.message?.content ?? ""


    // Parse insights into individual items
    const insightLines = insightContent.split("\n").filter((line) => line.trim().length > 0)

    const insights = insightLines.slice(0, 4).map((line, index) => ({
      type: index === 0 ? "warning" : index === insightLines.length - 1 ? "tip" : "insight",
      title: line.split(":")[0] || `Insight ${index + 1}`,
      content: line,
    }))

    // Save insights to database
    const savedInsights = await Promise.all(
      insights.map((insight) =>
        Insight.create({
          userId: decoded.userId,
          title: insight.title,
          content: insight.content,
          type: insight.type,
          month: new Date(now.getFullYear(), now.getMonth(), 1),
        }),
      ),
    )

    return NextResponse.json({
      insights: savedInsights.map((i) => ({
        _id: i._id,
        title: i.title,
        content: i.content,
        type: i.type,
      })),
      rawInsight: insightContent,
    })
  } catch (error) {
    console.error("AI insights error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
