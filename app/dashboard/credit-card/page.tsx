"use client"

import { CreditCardDisplay } from "@/components/credit/credit-card-display"
import { ScorePredictor } from "@/components/credit/score-predictor"

export default function CreditCardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Credit Card & Score</h1>
        <p className="text-muted-foreground">Monitor your credit card usage and predicted credit score changes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credit Card Section */}
        <div className="lg:col-span-1">
          <CreditCardDisplay />
        </div>

        {/* Score Prediction Section */}
        <div className="lg:col-span-2">
          <ScorePredictor />
        </div>
      </div>

      {/* Tips Section */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Credit Building Tips</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-accent">1</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Keep Utilization Low</h3>
            <p className="text-sm text-muted-foreground">
              Try to keep your credit utilization below 30% for optimal score
            </p>
          </div>

          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-accent">2</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Pay On Time</h3>
            <p className="text-sm text-muted-foreground">Always make payments on or before the due date</p>
          </div>

          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-accent">3</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Monitor Regularly</h3>
            <p className="text-sm text-muted-foreground">Check your credit score and utilization monthly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
