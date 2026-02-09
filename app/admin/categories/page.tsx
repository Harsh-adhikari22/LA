import { createClient } from "@/lib/supabase/server"
import CategoriesManager from "@/components/admin/CategoriesManager"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return <div className="p-6 text-red-300">{error.message}</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.8)]">
        Categories
      </h1>
      <CategoriesManager initial={categories ?? []} />
    </div>
  )
}
