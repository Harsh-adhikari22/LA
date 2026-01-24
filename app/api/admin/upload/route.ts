// app/api/admin/upload/route.ts
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const formData = await req.formData()
  const file = formData.get("file") as File
  const bucket = formData.get("bucket") as string

  if (!file || !bucket){ 
    console.log("Either File or bucket is missing")
    return new Response(JSON.stringify({ error: "Missing file or bucket" }), { status: 400 })
  }
  const filePath = `${Date.now()}-${file.name}`
  console.log("filePath : ",filePath)
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { cacheControl: "3600", upsert: false })
  if (error){ 
    console.log("error : ",error)
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return new Response(JSON.stringify({ publicUrl: urlData.publicUrl }))
}
