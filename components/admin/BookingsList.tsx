"use client"

import { useMemo, useState } from "react"
import DeliveryStatusSelect from "@/components/admin/DeliveryStatusSelect"

const DELIVERY_BG: Record<string, string> = {
  order_received: "bg-yellow-50",
  processing: "bg-blue-50",
  out_for_delivery: "bg-purple-50",
  delivered: "bg-green-50",
}

export default function BookingsList({ orders }: { orders: any[] }) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    if (!query) return orders

    const q = query.toLowerCase()

    return orders.filter((o) => {
      return (
        o.id.toLowerCase().includes(q) ||
        o.full_name?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q) ||
        new Date(o.created_at).toLocaleString().toLowerCase().includes(q)
      )
    })
  }, [orders, query])

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        placeholder="Search by order id, name, email, phone, or time..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />

      {filtered.map((order) => (
        <div
          key={order.id}
          className={`border rounded-lg p-4 space-y-3 transition ${
            DELIVERY_BG[order.delivery_status] || "bg-white"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold">{order.full_name}</h2>
              <p className="text-sm text-gray-600">{order.email}</p>
              <p className="text-sm text-gray-600">
                {order.phone} • {order.city}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Order ID: {order.id}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">₹{order.total_amount}</p>

              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize
                ${
                  order.status === "success"
                    ? "bg-green-100 text-green-700"
                    : order.status === "pending"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {order.status}
              </span>

              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-3 space-y-2">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.event_title}</p>
                  <p className="text-gray-500">
                    Qty: {item.quantity} × ₹{item.unit_price}
                  </p>
                </div>

                <div className="font-medium">₹{item.total_price}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-2 text-xs text-gray-500 flex justify-between items-center">
            <span>Payment: {order.payment_method}</span>

            <DeliveryStatusSelect
              orderId={order.id}
              current={order.delivery_status}
            />
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-gray-500">No matching bookings</p>
      )}
    </div>
  )
}
