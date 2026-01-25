import { createClient } from "@/lib/supabase/server"
import CategoriesManager from "@/components/admin/CategoriesManager"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return <div className="p-6">{error.message}</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <CategoriesManager initial={categories ?? []} />
    </div>
  )
}
