/**
 * Razorpay and Order Types
 * Central type definitions for payment and order operations
 */

// ============================================
// Razorpay API Response Types
// ============================================

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: "created" | "paid" | "attempted" | "failed"
  attempts: number
  notes: Record<string, any>
  created_at: number
}

export interface RazorpayPayment {
  id: string
  entity: string
  amount: number
  currency: string
  status: "captured" | "authorized" | "failed" | "refunded"
  order_id: string
  invoice_id: string | null
  international: boolean
  method: string
  amount_refunded: number
  refund_status: string | null
  captured: boolean
  description: string
  card_id: string | null
  bank: string | null
  wallet: string | null
  vpa: string | null
  email: string
  contact: string
  created_at: number
}

export interface RazorpayRefund {
  id: string
  entity: string
  payment_id: string
  amount: number
  currency: string
  notes: Record<string, any>
  receipt: string | null
  status: "processed" | "failed" | "pending"
  created_at: number
}

// ============================================
// Frontend Razorpay Options
// ============================================

export interface RazorpayPrefill {
  name?: string
  email?: string
  contact?: string
}

export interface RazorpayTheme {
  color?: string
  backdrop?: boolean
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name?: string
  description?: string
  image?: string
  prefill?: RazorpayPrefill
  notes?: Record<string, any>
  handler: (response: RazorpayResponse) => void
  theme?: RazorpayTheme
  modal?: {
    ondismiss?: () => void
    confirm_close?: boolean
  }
}

export interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// ============================================
// Database Models
// ============================================

export interface Order {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  total_amount: number
  status: "pending" | "success" | "failed"
  payment_method: string
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  event_id: string
  event_title: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

// ============================================
// API Request/Response Types
// ============================================

export interface CreateOrderRequest {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
}

export interface CreateOrderResponse {
  success: boolean
  razorpayOrderId: string
  razorpayKeyId: string
  amount: number
  currency: string
  cartData: {
    items: any[]
    total: number
  }
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
}

export interface VerifyPaymentResponse {
  success: boolean
  orderId: string
  message: string
  order: OrderWithItems
}

export interface SendOrderEmailRequest {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  totalAmount: number
  items: Array<{
    event_title: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export interface SendOrderEmailResponse {
  success: boolean
  message: string
}

export interface PaymentError {
  code?: string
  description?: string
  source?: string
  reason?: string
  field?: string
  field_value?: string
}

// ============================================
// Webhook Types
// ============================================

export interface RazorpayWebhookPayload {
  event: string
  contains: string[]
  payload: {
    payment?: {
      entity: RazorpayPayment
    }
    order?: {
      entity: RazorpayOrder
    }
    refund?: {
      entity: RazorpayRefund
    }
  }
  created_at: number
}

export type PaymentEventType =
  | "payment.authorized"
  | "payment.failed"
  | "payment.captured"
  | "refund.created"
  | "refund.failed"

// ============================================
// Utility Types
// ============================================

export interface PaymentStatus {
  status: "pending" | "success" | "failed"
  message: string
  orderId?: string
  paymentId?: string
  amount?: number
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  successfulOrders: number
  failedOrders: number
}

// ============================================
// Error Types
// ============================================

export class RazorpayError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = "RazorpayError"
  }
}

export class PaymentVerificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PaymentVerificationError"
  }
}

export class OrderCreationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "OrderCreationError"
  }
}

// ============================================
// Constants
// ============================================

export const RAZORPAY_CONSTANTS = {
  CURRENCY: "INR",
  MIN_AMOUNT: 1, // ₹1
  MAX_AMOUNT: 100000000, // ₹1 crore
  ORDER_EXPIRY: 900, // 15 minutes in seconds
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000, // 30 seconds
} as const

export const PAYMENT_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const

export const PAYMENT_METHODS = {
  RAZORPAY: "razorpay",
  CARD: "card",
  NETBANKING: "netbanking",
  WALLET: "wallet",
  UPI: "upi",
} as const
