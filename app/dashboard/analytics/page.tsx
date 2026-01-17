"use client"

import { IncomeExpenseChart } from "@/components/analytics/income-expense-chart"
import { CategoryChart } from "@/components/analytics/category-chart"
import { SummaryStats } from "@/components/analytics/summary-stats"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">Visualize your financial trends and spending patterns</p>
      </div>

      {/* Summary Statistics */}
      <SummaryStats />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Trend */}
        <div className="glass rounded-xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Income vs Expenses Trend</h2>
          <IncomeExpenseChart />
        </div>

        {/* Category Breakdown */}
        <div className="glass rounded-xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Expense Breakdown by Category</h2>
          <CategoryChart />
        </div>
      </div>

      {/* Financial Health Tips */}
      <div className="glass rounded-xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">Financial Health Tips</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
            <h3 className="font-semibold text-foreground mb-3">Track Spending Trends</h3>
            <p className="text-sm text-muted-foreground">
              Review your monthly trends to identify spending patterns and adjust your budget accordingly
            </p>
          </div>

          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">Category Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Look at your spending by category to find areas where you can cut back and save more
            </p>
          </div>

          <div className="p-6 rounded-lg bg-accent/5 border border-accent/20">
            <h3 className="font-semibold text-foreground mb-3">Income Goals</h3>
            <p className="text-sm text-muted-foreground">
              Set income targets and monitor progress towards achieving your financial objectives
            </p>
          </div>

          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">Savings Rate</h3>
            <p className="text-sm text-muted-foreground">
              Aim for a healthy savings rate by ensuring income consistently exceeds expenses
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
