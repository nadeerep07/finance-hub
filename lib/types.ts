export interface User {
  _id: string
  email: string
  name: string
  monthlyIncome: number
  creditLimit: number
  creditScore: number
  createdAt: Date
}

export interface Transaction {
  _id: string
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  description?: string
  date: Date
  createdAt: Date
}

export interface CreditCard {
  _id: string
  userId: string
  cardName: string
  creditLimit: number
  usedAmount: number
  lastUpdated: Date
}

export interface Insight {
  _id: string
  userId: string
  title: string
  content: string
  type: "tip" | "warning" | "insight"
  month: Date
}

export interface DashboardData {
  monthlyIncome: number
  monthlyExpense: number
  savings: number
  creditUtilization: number
  creditScore: number
}
