"use client"

import { useEffect, useState } from "react"
import { InsightCard } from "@/components/ai/insight-card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface Insight {
  _id: string
  title: string
  content: string
  type: "tip" | "warning" | "insight"
}

export function InsightsSection() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/ai/insights/list", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error("Failed to fetch insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  const handleGenerateInsights = async () => {
    setGenerating(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/ai/generate-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      }
    } catch (error) {
      console.error("Failed to generate insights:", error)
    } finally {
      setGenerating(false)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">AI Financial Insights</h2>
        <Button
          onClick={handleGenerateInsights}
          disabled={generating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <Sparkles size={18} />
          <span>{generating ? "Generating..." : "Generate Insights"}</span>
        </Button>
      </div>

      {insights.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Sparkles className="mx-auto mb-4 text-muted-foreground" size={32} />
          <p className="text-muted-foreground mb-4">No insights generated yet</p>
          <Button
            onClick={handleGenerateInsights}
            disabled={generating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Sparkles size={16} />
            <span>{generating ? "Generating..." : "Generate Your First Insights"}</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <InsightCard key={insight._id} title={insight.title} content={insight.content} type={insight.type} />
          ))}
        </div>
      )}
    </div>
  )
}
