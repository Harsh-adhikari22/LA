"use client"

import { useMemo, useState } from "react"
import DeliveryStatusSelect from "@/components/admin/DeliveryStatusSelect"
import { Button } from "@/components/ui/button"
import { exportToExcel } from "@/lib/export-to-excel"

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

  const handleExport = async () => {
    const data = filtered.map((order) => ({
      order_id: order.id,
      full_name: order.full_name,
      email: order.email,
      phone: order.phone,
      city: order.city,
      total_amount: order.total_amount,
      status: order.status,
      delivery_status: order.delivery_status,
      payment_method: order.payment_method,
      created_at: order.created_at ? new Date(order.created_at).toLocaleString() : "",
      items: (order.order_items || [])
        .map((item: any) => `${item.event_title} (x${item.quantity})`)
        .join("; "),
    }))

    await exportToExcel({
      data,
      fileName: "bookings",
      sheetName: "Bookings",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search by order id, name, email, phone, or time..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-[#b88a22]/40 rounded px-3 py-2 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
        />
        <Button
          variant="outline"
          onClick={handleExport}
          className="sm:w-auto border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
        >
          Export to Excel
        </Button>
      </div>

      {filtered.map((order) => (
        <div
          key={order.id}
          className="border border-[#b88a22]/40 rounded-lg p-4 space-y-3 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)]"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-semibold text-[#f2d47a]">{order.full_name}</h2>
              <p className="text-sm text-[#e6c768]">{order.email}</p>
              <p className="text-sm text-[#e6c768]">
                {order.phone} • {order.city}
              </p>

              <p className="text-xs text-[#d4af37]/70 mt-1">
                Order ID: {order.id}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-[#f2d47a]">₹{order.total_amount}</p>

              <span
                className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize
                ${
                  order.status === "success"
                    ? "bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/40"
                    : order.status === "pending"
                    ? "bg-red-900/40 text-red-200 border border-red-700/50"
                    : "bg-gray-900/40 text-gray-200 border border-gray-700/50"
                }`}
              >
                {order.status}
              </span>

              <p className="text-xs text-[#d4af37]/70 mt-1">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-[#b88a22]/30 pt-3 space-y-2">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-[#f2d47a]">{item.event_title}</p>
                  <p className="text-[#d4af37]/70">
                    Qty: {item.quantity} × ₹{item.unit_price}
                  </p>
                </div>

                <div className="font-medium text-[#f2d47a]">₹{item.total_price}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-[#b88a22]/30 pt-2 text-xs text-[#d4af37]/70 flex justify-between items-center">
            <span>Payment: {order.payment_method}</span>

            <DeliveryStatusSelect
              orderId={order.id}
              current={order.delivery_status}
            />
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-[#d4af37]/70">No matching bookings</p>
      )}
    </div>
  )
}
