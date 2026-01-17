"use client"

import { useState } from "react"
import { AddTransactionForm } from "@/components/transactions/add-transaction-form"
import { TransactionList } from "@/components/transactions/transaction-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("view")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [viewTab, setViewTab] = useState("all")

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1) // Increment to trigger refresh
    setActiveTab("view")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Transactions</h1>
        <p className="text-muted-foreground">Manage your income and expenses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 rounded-lg p-1">
          <TabsTrigger value="add-expense">Add Expense</TabsTrigger>
          <TabsTrigger value="add-income">Add Income</TabsTrigger>
          <TabsTrigger value="view">View All</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {/* Add Expense Tab */}
          <TabsContent value="add-expense" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Add Expense</h2>
                  <AddTransactionForm type="expense" onSuccess={handleSuccess} />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Recent Transactions</h2>
                  <TransactionList refresh={refreshTrigger} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Add Income Tab */}
          <TabsContent value="add-income" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Add Income</h2>
                  <AddTransactionForm type="income" onSuccess={handleSuccess} />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Recent Transactions</h2>
                  <TransactionList refresh={refreshTrigger} />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* View All Tab */}
          <TabsContent value="view" className="mt-0">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">All Transactions</h2>
                <Tabs value={viewTab} onValueChange={setViewTab} className="w-auto">
                  <TabsList className="bg-secondary/50">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <TransactionList
                type={viewTab === "all" ? undefined : (viewTab as "income" | "expense")}
                refresh={refreshTrigger}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}