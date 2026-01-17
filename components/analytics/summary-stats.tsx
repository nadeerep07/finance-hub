"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, PiggyBank, CreditCard } from "lucide-react"

interface SummaryData {
  totalIncome: number
  totalExpenses: number
  savings: number
  averageMonthly: number
}

export function SummaryStats() {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const response = await fetch("/api/analytics/data?months=6", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const result = await response.json()
          const monthlyData = result.monthlyTrend

          const totalIncome = monthlyData.reduce((sum: number, m: any) => sum + m.income, 0)
          const totalExpenses = monthlyData.reduce((sum: number, m: any) => sum + m.expense, 0)
          const savings = totalIncome - totalExpenses
          const averageMonthly = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0

          setData({
            totalIncome,
            totalExpenses,
            savings,
            averageMonthly,
          })
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">Total Income</p>
            <p className="text-2xl font-bold text-accent">
              ₹{data.totalIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <TrendingUp className="text-accent opacity-20" size={24} />
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">Total Expenses</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{data.totalExpenses.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <TrendingDown className="text-destructive opacity-20" size={24} />
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">Net Savings</p>
            <p className={`text-2xl font-bold ${data.savings >= 0 ? "text-accent" : "text-destructive"}`}>
              ₹{data.savings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <PiggyBank className={`${data.savings >= 0 ? "text-accent" : "text-destructive"} opacity-20`} size={24} />
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-2">Avg Monthly</p>
            <p className="text-2xl font-bold text-primary">
              ₹{data.averageMonthly.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <CreditCard className="text-primary opacity-20" size={24} />
        </div>
      </div>
    </div>
  )
}
