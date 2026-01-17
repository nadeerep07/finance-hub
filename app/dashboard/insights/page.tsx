"use client"

import { InsightsSection } from "@/components/ai/insights-section"

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">AI Financial Insights</h1>
        <p className="text-muted-foreground">Get personalized financial advice and recommendations powered by AI</p>
      </div>

      <div className="glass rounded-xl p-8 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-primary">🤖</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground mb-2">Smart Financial Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your spending patterns, credit utilization, and financial behavior to provide personalized
              recommendations for improving your financial health.
            </p>
          </div>
        </div>
      </div>

      <InsightsSection />

      {/* Educational Section */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">How AI Insights Help</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="font-semibold text-foreground mb-2">Spending Analysis</div>
            <p className="text-sm text-muted-foreground">
              Understand your spending patterns and identify areas where you can save money
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="font-semibold text-foreground mb-2">Credit Score Tips</div>
            <p className="text-sm text-muted-foreground">
              Get actionable advice to improve your credit score and build a healthier credit profile
            </p>
          </div>

          <div className="p-4 rounded-lg bg-secondary/30">
            <div className="font-semibold text-foreground mb-2">Financial Goals</div>
            <p className="text-sm text-muted-foreground">
              Receive personalized recommendations to achieve your financial objectives faster
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
