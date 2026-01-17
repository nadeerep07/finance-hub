"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, TrendingUp } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link href="/dashboard/transactions?tab=add-expense" className="flex-1">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11">
          <Plus size={18} />
          <span>Add Expense</span>
        </Button>
      </Link>

      <Link href="/dashboard/transactions?tab=add-income" className="flex-1">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11">
          <TrendingUp size={18} />
          <span>Add Income</span>
        </Button>
      </Link>

      <Button className="flex-1 glass hover:bg-secondary/50 text-foreground font-semibold h-11">
        <Download size={18} />
        <span>Export Report</span>
      </Button>
    </div>
  )
}
