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
  order_received: "bg-black/80 text-[#f2d47a] border-[#b88a22]/40",
  processing: "bg-black/80 text-[#f2d47a] border-[#b88a22]/40",
  out_for_delivery: "bg-black/80 text-[#f2d47a] border-[#b88a22]/40",
  delivered: "bg-black/80 text-[#f2d47a] border-[#b88a22]/40",
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
      className={`border rounded px-2 py-1 text-xs capitalize transition bg-black/80 text-[#f2d47a] border-[#b88a22]/40 ${
        STATUS_STYLES[value] || ""
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
