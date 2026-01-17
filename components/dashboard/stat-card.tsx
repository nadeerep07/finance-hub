"use client"

import type React from "react"

import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  unit?: string
  icon?: React.ReactNode
  gradient?: boolean
}

export function StatCard({ title, value, change, unit = "₹", icon, gradient }: StatCardProps) {
  const isPositive = change && change > 0

  return (
    <div className="glass rounded-xl p-6 hover:bg-secondary/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold ${gradient ? "gradient-text" : "text-foreground"}`}>
              {unit}
              {typeof value === "number" ? value.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : value}
            </span>
          </div>
        </div>
        {icon && <div className="text-primary opacity-20">{icon}</div>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          {isPositive ? (
            <>
              <TrendingUp size={16} className="text-accent" />
              <span className="text-accent font-semibold">+{change.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-destructive" />
              <span className="text-destructive font-semibold">{change.toFixed(1)}%</span>
            </>
          )}
          <span className="text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  )
}
