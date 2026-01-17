"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { StatCard } from "@/components/dashboard/stat-card"
import { CreditScoreCard } from "@/components/dashboard/credit-score-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ArrowDownRight, ArrowUpRight, Wallet, CreditCard, Calendar } from "lucide-react"

interface DashboardData {
  monthlyIncome: number
  monthlyExpense: number
  savings: number
  creditUtilization: number
  creditScore: number
  incomeChange: number
  expenseChange: number
  savingsChange: number
  utilizationChange: number
}

interface Transaction {
  _id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    if (!user) return
    
    setLoading(true)
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        // Fetch stats and transactions in parallel
        const [statsResponse, transactionsResponse] = await Promise.all([
          fetch("/api/dashboard/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/transactions/list", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setData(stats)
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          setTransactions(transactionsData.slice(0, 5)) // Show only 5 most recent
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  // Refresh when window gains focus (user comes back from another tab/page)
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-IN", { 
        month: "short", 
        day: "numeric",
      })
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's your financial overview for this month</p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={data.monthlyIncome}
          change={data.incomeChange}
          icon={<ArrowUpRight size={24} />}
          gradient
        />
        <StatCard
          title="Monthly Expenses"
          value={data.monthlyExpense}
          change={data.expenseChange}
          icon={<ArrowDownRight size={24} />}
        />
        <StatCard 
          title="Available to Spend" 
          value={data.savings} 
          change={data.savingsChange} 
          icon={<Wallet size={24} />} 
          gradient 
        />
        <StatCard
          title="Credit Utilization"
          value={`${data.creditUtilization}%`}
          unit=""
          change={data.utilizationChange}
          icon={<CreditCard size={24} />}
        />
      </div>

      {/* Credit Score Section */}
      <CreditScoreCard score={data.creditScore} trend="up" />

      {/* Recent Transactions */}
      <div className="glass rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">No transactions yet. Start by adding your first expense or income.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-accent/10" : "bg-primary/10"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="text-accent" size={20} />
                    ) : (
                      <ArrowDownRight className="text-primary" size={20} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">{transaction.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {transaction.description && (
                        <>
                          <span className="text-sm text-muted-foreground">{transaction.description}</span>
                          <span className="text-muted-foreground">•</span>
                        </>
                      )}
                      <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.type === "income" ? "text-accent" : "text-foreground"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}