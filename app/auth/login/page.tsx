import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Sign In - FinanceHub",
  description: "Sign in to your FinanceHub account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
