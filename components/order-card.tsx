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
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "bg-yellow-100 text-yellow-800",
    icon: Truck,
  },
  in_transit: {
    label: "In Transit",
    color: "bg-orange-100 text-orange-800",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  order_failed: {
    label: "Order Failed",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle,
  },
}

export function OrderCard({ order }: { order: OrderCardProps }) {
  const statusConfig = STATUS_CONFIG[order.delivery_status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.order_received
  const StatusIcon = statusConfig.icon

  return (
    <Card className="hover:shadow-lg transition-shadow py-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">Order #{order.razorpay_order_id.slice(-8).toUpperCase()}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <Badge className={statusConfig.color}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Delivery Address */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-semibold text-gray-700">Delivery Address</p>
          <p className="text-sm text-gray-600 mt-1">{order.full_name}</p>
          <p className="text-sm text-gray-600">{order.address}</p>
          <p className="text-sm text-gray-600">{order.city}</p>
        </div>

        {/* Order Items */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
          <div className="space-y-2">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-700">{item.event_title}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-gray-700 font-medium">₹{item.total_price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Total Amount and Payment Status */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">₹{order.total_amount.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Payment Status</p>
            <Badge variant={order.status === "success" ? "default" : "secondary"}>
              {order.status === "success" ? "Paid" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
