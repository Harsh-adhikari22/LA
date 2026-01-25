import { createAdminClient } from "@/lib/supabase/server"

export async function PUT(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { userId, action } = body

  if (!userId || !action) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), {
      status: 400,
    })
  }

  let update: any = {}

  if (action === "promote") update.is_admin = true
  if (action === "demote") update.is_admin = false
  if (action === "ban") update.is_banned = true
  if (action === "unban") update.is_banned = false
  console.log("Updating user:", userId, "with", update)

  const { data, error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select()
  console.log("updated rows:", data)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }

  return new Response(JSON.stringify({ success: true }))
}
