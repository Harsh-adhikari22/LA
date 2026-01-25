import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { title, description, image_url } = body

  const { error } = await supabase.from("categories").insert([
    {
      title,
      description,
      image_url,
    },
  ])

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }))
}

export async function PUT(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { id, title, description, image_url } = body

  const { error } = await supabase
    .from("categories")
    .update({ title, description, image_url })
    .eq("id", id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }))
}

export async function DELETE(req: Request) {
  const supabase = createAdminClient()
  const body = await req.json()

  const { id } = body

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }))
}
