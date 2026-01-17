"use client"

import { useEffect, useState } from "react"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface ScorePrediction {
  currentScore: number
  predictedScore: number
  scoreChange: number
  creditUtilization: number
  factors: {
    utilizationFactor: string
    spendingPattern: string
  }
}

export function ScorePredictor() {
  const [prediction, setPrediction] = useState<ScorePrediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const response = await fetch("/api/credit-score/predict", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setPrediction(data)
        }
      } catch (error) {
        console.error("Failed to fetch prediction:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [])

  if (loading || !prediction) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin">
          <div className="w-8 h-8 rounded-full border-4 border-border border-t-primary"></div>
        </div>
      </div>
    )
  }

  const isImproving = prediction.scoreChange > 0

  return (
    <div className="glass rounded-xl p-8">
      <h3 className="text-xl font-bold text-foreground mb-8">Credit Score Prediction</h3>

      {/* Score Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-lg bg-secondary/30">
          <p className="text-sm text-muted-foreground mb-2">Current Score</p>
          <p className="text-4xl font-bold text-foreground">{prediction.currentScore}</p>
          <p className="text-xs text-muted-foreground mt-2">Your current credit score</p>
        </div>

        <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Predicted Score</p>
          <p className="text-4xl font-bold text-primary">{prediction.predictedScore}</p>
          <div className="flex items-center gap-2 mt-2">
            {isImproving ? (
              <>
                <TrendingUp className="text-accent" size={16} />
                <span className="text-sm font-semibold text-accent">+{prediction.scoreChange} points</span>
              </>
            ) : (
              <>
                <TrendingDown className="text-destructive" size={16} />
                <span className="text-sm font-semibold text-destructive">{prediction.scoreChange} points</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Factors */}
      <div className="space-y-4 border-t border-border pt-6">
        <h4 className="font-semibold text-foreground">Analysis Factors</h4>

        <div className="space-y-3">
          <div className="flex justify-between items-start p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-medium text-foreground">Credit Utilization</p>
              <p className="text-sm text-muted-foreground mt-1">{prediction.factors.utilizationFactor}</p>
            </div>
            <span className="font-bold text-lg">{prediction.creditUtilization}%</span>
          </div>

          <div className="flex justify-between items-start p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-medium text-foreground">Spending Pattern</p>
              <p className="text-sm text-muted-foreground mt-1">{prediction.factors.spendingPattern}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {!isImproving && (
        <div className="mt-6 p-4 rounded-lg bg-destructive/5 border border-destructive/20 flex gap-3">
          <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="font-semibold text-destructive mb-1">Score Trending Down</p>
            <p className="text-muted-foreground">Reduce credit card spending and focus on timely payments</p>
          </div>
        </div>
      )}
    </div>
  )
}
