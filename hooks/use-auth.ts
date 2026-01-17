"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  email: string
  name: string
  creditScore: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          localStorage.removeItem("authToken")
          setLoading(false)
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        console.error("Auth check failed:", err)
        localStorage.removeItem("authToken")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      localStorage.setItem("authToken", data.token)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      localStorage.setItem("authToken", data.token)
      setUser(data.user)
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    router.push("/auth/login")
  }

  return { user, loading, error, login, register, logout }
}
