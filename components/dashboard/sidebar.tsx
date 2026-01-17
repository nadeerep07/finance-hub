"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, TrendingUp, CreditCard, BarChart3, Zap, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Sidebar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "Transactions", href: "/dashboard/transactions" },
    { icon: CreditCard, label: "Credit Card", href: "/dashboard/credit-card" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Zap, label: "AI Insights", href: "/dashboard/insights" },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 glass border-r border-border transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-8 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="text-primary-foreground" size={24} />
              </div>
              <h1 className="text-xl font-bold text-foreground">FinanceHub</h1>
            </div>
            <p className="text-xs text-muted-foreground">Your financial companion</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors group"
                >
                  <item.icon size={20} className="group-hover:text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="pt-6 border-t border-border">
            <div className="mb-6 p-4 rounded-lg bg-secondary/30">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-semibold text-foreground text-sm mt-1">{user?.email}</p>
            </div>

            <Button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
