"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants"
import { AlertCircle } from "lucide-react"

interface AddTransactionFormProps {
  type: "income" | "expense"
  onSuccess: () => void
}

export function AddTransactionForm({ type, onSuccess }: AddTransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Not authenticated")
        return
      }

      const response = await fetch("/api/transactions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          category: formData.category,
          amount: Number.parseFloat(formData.amount),
          description: formData.description,
          date: formData.date,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to create transaction")
        return
      }

      setFormData({
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })

      onSuccess()
    } catch (err) {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
          <AlertCircle className="text-destructive flex-shrink-0" size={18} />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-muted-foreground font-semibold">₹</span>
          <Input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="pl-8 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Description (Optional)</label>
        <Input
          type="text"
          placeholder="Add a note..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-3">Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="bg-secondary/50 border-border text-foreground"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold h-11 rounded-lg transition-colors ${
          type === "income"
            ? "bg-accent hover:bg-accent/90 text-accent-foreground"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
      >
        {loading ? "Adding..." : `Add ${type === "income" ? "Income" : "Expense"}`}
      </Button>
    </form>
  )
}
