"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface CreditCardData {
  creditLimit: number
  usedAmount: number
  utilization: number
  availableCredit: number
}

export function CreditCardDisplay() {
  const [card, setCard] = useState<CreditCardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const response = await fetch("/api/credit-card/get", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setCard(data)
        }
      } catch (error) {
        console.error("Failed to fetch credit card:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [])

  if (loading || !card) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary"></div>
        </div>
      </div>
    )
  }

  const utilizationColor =
    card.utilization > 70 ? "text-destructive" : card.utilization > 50 ? "text-chart-3" : "text-accent"

  return (
    <div className="space-y-6">
      {/* Credit Card Visual */}
      <div className="glass rounded-2xl p-8 bg-gradient-to-br from-primary/20 to-accent/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <p className="text-sm text-muted-foreground font-medium">Primary Credit Card</p>
            <p className="text-2xl font-bold text-foreground mt-2">•••• •••• •••• 8490</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Credit Limit</p>
              <p className="text-2xl font-bold text-foreground">₹{card.creditLimit.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Available Credit</p>
              <p className="text-2xl font-bold text-accent">₹{card.availableCredit.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Utilization Details */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-6">Credit Utilization</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <span className="text-sm text-muted-foreground">Used</span>
              <span className={`text-lg font-bold ${utilizationColor}`}>{card.utilization}%</span>
            </div>

            <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  card.utilization > 70 ? "bg-destructive" : card.utilization > 50 ? "bg-chart-3" : "bg-accent"
                }`}
                style={{ width: `${Math.min(100, card.utilization)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-3">
              <span>₹{card.usedAmount.toFixed(2)} used</span>
              <span>₹{card.creditLimit.toFixed(2)} limit</span>
            </div>
          </div>

          {/* Health Status */}
          <div className="pt-4 border-t border-border">
            {card.utilization > 70 ? (
              <div className="flex gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-semibold text-destructive mb-1">High Utilization</p>
                  <p className="text-muted-foreground">Keep it below 30% for optimal credit score</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm">
                  <p className="font-semibold text-accent mb-1">Healthy Utilization</p>
                  <p className="text-muted-foreground">Keep up the good spending habits</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
