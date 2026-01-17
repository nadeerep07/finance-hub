"use client"

import { Lightbulb, AlertCircle, Zap } from "lucide-react"

interface InsightCardProps {
  title: string
  content: string
  type: "tip" | "warning" | "insight"
}

export function InsightCard({ title, content, type }: InsightCardProps) {
  const iconMap = {
    tip: <Lightbulb className="text-accent" size={20} />,
    warning: <AlertCircle className="text-destructive" size={20} />,
    insight: <Zap className="text-primary" size={20} />,
  }

  const bgMap = {
    tip: "bg-accent/5 border-accent/20",
    warning: "bg-destructive/5 border-destructive/20",
    insight: "bg-primary/5 border-primary/20",
  }

  const textColorMap = {
    tip: "text-accent",
    warning: "text-destructive",
    insight: "text-primary",
  }

  return (
    <div className={`glass rounded-xl p-6 border ${bgMap[type]}`}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
        <div className="flex-1">
          <h3 className={`font-semibold ${textColorMap[type]} mb-2`}>{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  )
}
