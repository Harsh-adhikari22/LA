"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"

const STATUSES = [
  "order_received",
  "processing",
  "out_for_delivery",
  "delivered",
]

const STATUS_STYLES: Record<string, string> = {
  order_received: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
}

export default function DeliveryStatusSelect({
  orderId,
  current,
}: {
  orderId: string
  current: string
}) {
  const [value, setValue] = useState(current)
  const [loading, setLoading] = useState(false)

  const updateStatus = async (next: string) => {
    setValue(next)
    setLoading(true)

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        body: JSON.stringify({
          orderId,
          delivery_status: next,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({
        title: "Updated",
        description: "Delivery status updated",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
      setValue(current)
    } finally {
      setLoading(false)
    }
  }

  return (
    <select
      disabled={loading}
      value={value}
      onChange={(e) => updateStatus(e.target.value)}
      className={`border rounded px-2 py-1 text-xs capitalize transition ${
        STATUS_STYLES[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  )
}
