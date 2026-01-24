"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { CategoryCard } from "./category-card"

interface CategoryCard {
  id: string
  title: string
  description: string
  image_url: string
}

interface FilterState {
  search: string
}

interface CategoryGridProps {
  searchQuery?: string
  filters?: FilterState
}

export function CategoryGrid({ searchQuery, filters }: CategoryGridProps) {
  const [categories, setCategories] = useState<CategoryCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from("categories")
          .select("*")

        if (filters) {
          // Search query filter
          if (filters.search) {
            query = query.or(
              `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
            )
          }
        } else {
          // Legacy search support
          if (searchQuery) {
            query = query.or(
              `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
            )
          }
        }

        const { data, error } = await query

        if (error) throw error

        setCategories(data || [])
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [searchQuery, filters, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 rajdhani">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading categories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 rajdhani">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-primary hover:underline">
          Try again
        </button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 rajdhani">
        <p className="text-gray-600 text-lg mb-4">No categories found</p>
        <p className="text-gray-500">Try adjusting your search criteria or check back later for new categories.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rajdhani">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
