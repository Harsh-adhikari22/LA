import { createClient } from "@/lib/supabase/server"

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const userId = params.id

  const { data: profile } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  const { data: wishlist } = await (await supabase)
    .from("wishlists")
    .select("events(title)")
    .eq("user_id", userId)

  const { data: reviews } = await (await supabase)
    .from("reviews")
    .select("stars, review, created_at, events(title)")
    .eq("user_id", userId)

  const { data: orders } = await (await supabase)
    .from("orders")
    .select(`
      id,
      total_amount,
      status,
      delivery_status,
      created_at,
      order_items (
        event_title,
        quantity,
        total_price
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{profile?.full_name}</h1>

      {/* Profile */}
      <div className="border rounded-lg p-4">
        <p>Email: {profile?.email}</p>
        <p>Phone: {profile?.phone}</p>
        <p>Admin: {profile?.is_admin ? "Yes" : "No"}</p>
      </div>

      {/* Wishlist */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Wishlist</h2>
        {wishlist?.length ? (
          <ul className="list-disc pl-5">
            {wishlist.map((w: any, i) => (
              <li key={i}>{w.events.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Empty</p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {reviews?.length ? (
          reviews.map((r: any, i) => (
            <div key={i} className="border rounded p-2 mb-2">
              <p className="font-medium">{r.events.title}</p>
              <p>⭐ {r.stars}</p>
              <p className="text-sm">{r.review}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews</p>
        )}
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Orders</h2>

        {orders?.map((o: any) => (
          <div key={o.id} className="border rounded p-3 mb-3">
            <div className="flex justify-between">
              <span>{new Date(o.created_at).toLocaleString()}</span>
              <span>₹{o.total_amount}</span>
            </div>

            <p className="text-sm capitalize">
              {o.status} • {o.delivery_status}
            </p>

            {o.order_items.map((i: any, idx: number) => (
              <div key={idx} className="text-sm ml-3">
                {i.event_title} × {i.quantity} — ₹{i.total_price}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
