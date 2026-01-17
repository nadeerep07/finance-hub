import mongoose, { Schema } from "mongoose"

// User Schema
export const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: String,
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 10000,
    },
    creditScore: {
      type: Number,
      default: 650,
    },
  },
  { timestamps: true },
)

// Transaction Schema
export const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Credit Card Schema
export const creditCardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardName: {
      type: String,
      default: "Primary Card",
    },
    creditLimit: {
      type: Number,
      required: true,
    },
    usedAmount: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// AI Insights Schema
export const insightSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    content: String,
    type: {
      type: String,
      enum: ["tip", "warning", "insight"],
    },
    month: Date,
  },
  { timestamps: true },
)

// Models
export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema)
export const CreditCard = mongoose.models.CreditCard || mongoose.model("CreditCard", creditCardSchema)
export const Insight = mongoose.models.Insight || mongoose.model("Insight", insightSchema)
