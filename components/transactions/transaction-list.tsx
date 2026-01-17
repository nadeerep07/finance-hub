"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  _id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

interface TransactionListProps {
  type?: "income" | "expense"
  month?: string
  refresh?: number // Changed from boolean to number
}

export function TransactionList({ type, month, refresh }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const params = new URLSearchParams()
      if (type) params.append("type", type)
      if (month) params.append("month", month)

      const response = await fetch(`/api/transactions/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [type, month, refresh]) // Will re-fetch when refresh number changes

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch(`/api/transactions/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setTransactions(transactions.filter((t) => t._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary"></div>
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No {type ? type : ""} transactions found
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction._id}
          className="glass rounded-lg p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-baseline gap-3">
              <h3 className="font-semibold text-foreground">{transaction.category}</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(transaction.date), "MMM dd, yyyy")}
              </p>
            </div>
            {transaction.description && (
              <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className={`font-bold text-lg ${
                transaction.type === "income" ? "text-accent" : "text-foreground"
              }`}>
                {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
              </p>
            </div>

            <Button
              onClick={() => handleDelete(transaction._id)}
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}