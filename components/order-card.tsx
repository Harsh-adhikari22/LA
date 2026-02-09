"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { CheckCircle, Clock, Package, AlertCircle, Truck, Home } from "lucide-react"

interface OrderItem {
  id: string
  event_id: string
  event_title: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderCardProps {
  id: string
  razorpay_order_id: string
  total_amount: number
  status: string
  delivery_status: string
  full_name: string
  address: string
  city: string
  created_at: string
  order_items: OrderItem[]
}

const STATUS_CONFIG = {
  order_received: {
    label: "Order Received",
    color: "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50",
    icon: Truck,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50",
    icon: CheckCircle,
  },
  order_failed: {
    label: "Order Failed",
    color: "bg-red-900/40 text-red-200 border border-red-700/50",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-900/40 text-gray-200 border border-gray-700/50",
    icon: AlertCircle,
  },
}

export function OrderCard({ order }: { order: OrderCardProps }) {
  const statusConfig = STATUS_CONFIG[order.delivery_status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.order_received
  const StatusIcon = statusConfig.icon

  return (
    <Card className="py-6 bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-[#f2d47a]">Order #{order.razorpay_order_id.slice(-8).toUpperCase()}</CardTitle>
            <p className="text-sm text-[#d4af37]/70 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-[#d4af37]" />
            <Badge className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Delivery Address */}
        <div className="bg-black/60 border border-[#b88a22]/40 p-3 rounded-lg">
          <p className="text-sm font-semibold text-[#f2d47a]">Delivery Address</p>
          <p className="text-sm text-[#e6c768] mt-1">{order.full_name}</p>
          <p className="text-sm text-[#e6c768]">{order.address}</p>
          <p className="text-sm text-[#e6c768]">{order.city}</p>
        </div>

        {/* Order Items */}
        <div>
          <p className="text-sm font-semibold text-[#f2d47a] mb-2">Items</p>
          <div className="space-y-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-[#e6c768]">{item.event_title}</p>
                  <p className="text-[#d4af37]/70 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#f2d47a] font-medium">₹{item.total_price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Total Amount and Payment Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#d4af37]/70">Total Amount</p>
            <p className="text-xl font-bold text-[#f2d47a]">₹{order.total_amount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#d4af37]/70">Payment Status</p>
            <Badge className={order.status === "success" ? "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/50" : "bg-gray-900/40 text-gray-200 border border-gray-700/50"}>
              {order.status === "success" ? "Paid" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
