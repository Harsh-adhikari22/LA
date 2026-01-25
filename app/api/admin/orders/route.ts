import { createClient } from "@/lib/supabase/server"

export async function PUT(req: Request) {
  const supabase = createClient()
  const body = await req.json()

  const { orderId, delivery_status } = body

  if (!orderId || !delivery_status) {
    return new Response(
      JSON.stringify({ error: "Missing orderId or delivery_status" }),
      { status: 400 }
    )
  }

  const { error } = await (await supabase)
    .from("orders")
    .update({
      delivery_status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }

  return new Response(JSON.stringify({ success: true }))
}
