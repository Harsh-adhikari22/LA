// app/api/admin/packages/route.ts
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = createClient() // uses service_role key internally
  const body = await req.json()

  // Upload main image if provided
  let mainImageUrl = body.image_url
  if (body.mainImageFile) {
    const filePath = `${Date.now()}-${body.mainImageFile.name}`
    const { error } = await (await supabase).storage.from("Categories").upload(filePath, body.mainImageFile)
    if (error) throw error
    const { data: urlData } = await (await supabase).storage.from("Categories").getPublicUrl(filePath)
    mainImageUrl = urlData.publicUrl
  }

  // Insert event
  const eventData = {
    title: body.title,
    description: body.description,
    actual_price: body.actual_price,
    discounted_price: body.discounted_price,
    category: body.category,
    image_url: mainImageUrl,
    additional_images: body.additional_images || [],
    trending: body.trending || false,
  }
  console.log("inserting event data:", eventData)
  const { error } = await (await supabase).from("events").insert([eventData])
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })

  return new Response(JSON.stringify({ success: true }))
}

export async function PUT(req: Request) {
  const supabase = createClient() // uses service_role key internally
  const body = await req.json()
  const { id } = body

  if (!id) {
    return new Response(JSON.stringify({ error: "Event ID is required" }), { status: 400 })
  }

  // Upload main image if provided
  let mainImageUrl = body.image_url
  if (body.mainImageFile) {
    const filePath = `${Date.now()}-${body.mainImageFile.name}`
    const { error } = await (await supabase).storage.from("Categories").upload(filePath, body.mainImageFile)
    if (error) throw error
    const { data: urlData } = await (await supabase).storage.from("Categories").getPublicUrl(filePath)
    mainImageUrl = urlData.publicUrl
  }

  // Update event
  const eventData = {
    title: body.title,
    description: body.description,
    actual_price: body.actual_price,
    discounted_price: body.discounted_price,
    category: body.category,
    image_url: mainImageUrl,
    additional_images: body.additional_images || [],
    trending: body.trending || false,
  }
  console.log("updating event with id:", id)
  console.log("updating event data:", eventData)
  const { error, data } = await (await supabase).from("events").update(eventData).eq("id", id).select()
  if (error) {
    console.error("Update error:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true, data }))
}
