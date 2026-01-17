import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(
  amount: number,
  options: { maximumFractionDigits?: number; style?: "decimal" | "currency" } = {},
): string {
  const { maximumFractionDigits = 0, style = "currency" } = options

  if (style === "currency") {
    return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits })}`
  }

  return amount.toLocaleString("en-IN", { maximumFractionDigits })
}

export function formatINRWithDecimals(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
