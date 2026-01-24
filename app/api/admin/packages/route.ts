// app/api/admin/packages/route.ts
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = createClient() // uses service_role key internally
  const body = await req.json()

  // Upload main image if provided
  let mainImageUrl = body.image_url
  if (body.mainImageFile) {
    const filePath = `${Date.now()}-${body.mainImageFile.name}`
    const { error } = await (await supabase).storage.from("Images").upload(filePath, body.mainImageFile)
    if (error) throw error
    const { data: urlData } = await (await supabase).storage.from("Images").getPublicUrl(filePath)
    mainImageUrl = urlData.publicUrl
  }

  // Insert package
  const packageData = {
    ...body,
    image_url: mainImageUrl,
    updated_at: new Date().toISOString(),
  }
  console.log("inserting package data:",packageData)
  const { error } = await (await supabase).from("party_packages").insert([packageData])
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 })

  return new Response(JSON.stringify({ success: true }))
}
