import { createClient } from "@/lib/supabase/server"
import DeliveryStatusSelect from "@/components/admin/DeliveryStatusSelect"
const DELIVERY_BG: Record<string, string> = {
  order_received: "bg-yellow-50",
  processing: "bg-blue-50",
  out_for_delivery: "bg-purple-50",
  delivered: "bg-green-50",
}
import BookingsList from "@/components/admin/BookingsList"


export default async function AdminBookingsPage() {
  const supabase = createClient()

  const { data: orders, error } = await (await supabase)
    .from("orders")
    .select(`
      id,
      total_amount,
      status,
      delivery_status,
      payment_method,
      created_at,
      full_name,
      email,
      phone,
      city,
      order_items (
        id,
        event_title,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Failed to load bookings</h2>
        <p className="text-red-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
    <h1 className="text-3xl font-bold">All Bookings</h1>
    <BookingsList orders={orders ?? []} />
  </div>
  )
}
