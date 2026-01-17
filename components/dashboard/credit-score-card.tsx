"use client"

import { AlertCircle, ArrowUp } from "lucide-react"

interface CreditScoreCardProps {
  score: number
  trend?: "up" | "down" | "stable"
}

export function CreditScoreCard({ score, trend = "stable" }: CreditScoreCardProps) {
  const scoreColor =
    score >= 750 ? "text-accent" : score >= 650 ? "text-chart-4" : score >= 550 ? "text-chart-3" : "text-destructive"

  return (
    <div className="glass rounded-xl p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-4">Credit Score</p>
            <div className={`text-5xl font-bold ${scoreColor} mb-2`}>{score}</div>
            <p className="text-xs text-muted-foreground">
              {score >= 750 ? "Excellent" : score >= 650 ? "Good" : score >= 550 ? "Fair" : "Poor"}
            </p>
          </div>
          {trend === "up" && (
            <div className="p-3 rounded-lg bg-accent/10">
              <ArrowUp className="text-accent" size={24} />
            </div>
          )}
        </div>

        {/* Score Progress Bar */}
        <div className="space-y-3">
          <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent"
              style={{ width: `${(score / 850) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>300</span>
            <span>850</span>
          </div>
        </div>

        {/* Score Tips */}
        {score < 700 && (
          <div className="mt-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" size={16} />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Improve Your Score</p>
              <p>Keep credit utilization below 30% and pay bills on time</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
