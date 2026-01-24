"use client"

import { useEffect, useState } from "react"
import { EventCard } from "./event-card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface Categories {
  id: string
  title: string
}

interface EventJoinCategories {
  id: string
  title: string
  discounted_price: number
  actual_price: number
  rating: number
  reviews_count: number
  category: string
  image_url: string
  trending: boolean
  categories: Categories | null
}

interface FilterState {
  search: string
  categories: string[]
  priceRange: [number, number]
  trending: boolean
}

interface EventGridProps {
  searchQuery?: string
  categories?: string[]
  limit?: number
  showTrendingOnly?: boolean
  filters?: FilterState
  sort?: "low" | "high" | "none"
}

export function EventGrid({ searchQuery, categories, limit, showTrendingOnly, filters, sort }: EventGridProps) {
  const [events, setEvents] = useState<EventJoinCategories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const searchTerm = filters?.search ?? searchQuery ?? ""
        const categoryIds = filters?.categories ?? categories ?? []

        // When there's a search term: resolve category IDs whose *title* matches (category string), not just event title/description
        let categoryIdsFromSearch: string[] = []
        if (searchTerm.trim()) {
          const { data: matchingCategories } = await supabase
            .from("categories")
            .select("id")
            .ilike("title", `%${searchTerm.trim()}%`)
          if (matchingCategories?.length) {
            categoryIdsFromSearch = matchingCategories.map((c) => c.id)
          }
        }

        let query = supabase
          .from("events")
          .select(`
            *,
            categories (
              id,
              title
            )
          `)

        if (filters) {
          // Search: match event title, description, OR category title (via categories table)
        if (searchTerm.trim()) {
          const escaped = searchTerm.trim().replace(/'/g, "''").replace(/,/g, " ")
          const titleDesc = `title.ilike.%${escaped}%,description.ilike.%${escaped}%`
            if (categoryIdsFromSearch.length) {
              const catIn = `category.in.(${categoryIdsFromSearch.join(",")})`
              query = query.or(`${titleDesc},${catIn}`)
            } else {
              query = query.or(titleDesc)
            }
          }

          // Explicit category filter (e.g. from URL ?category=uuid): filter by category ID
          if (categoryIds.length) {
            query = query.in("category", categoryIds)
          }

          if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
            query = query
              .gte("discounted_price", filters.priceRange[0])
              .lte("discounted_price", filters.priceRange[1])
          }
          if (filters.trending) {
            query = query.eq("trending", true)
          }
        } else {
          if (searchTerm) {
            const escaped = searchTerm.trim().replace(/'/g, "''").replace(/,/g, " ")
            const titleDesc = `title.ilike.%${escaped}%,description.ilike.%${escaped}%`
            if (categoryIdsFromSearch.length) {
              const catIn = `category.in.(${categoryIdsFromSearch.join(",")})`
              query = query.or(`${titleDesc},${catIn}`)
            } else {
              query = query.or(titleDesc)
            }
          }
          if (categoryIds.length) {
            query = query.in("category", categoryIds)
          }
          if (showTrendingOnly) {
            query = query.eq("trending", true)
          }
        }

        if (sort === "low") {
          query = query.order("discounted_price", { ascending: true })
        }
        if (sort === "high") {
          query = query.order("discounted_price", { ascending: false })
        }
        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query
        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [searchQuery, categories, limit, showTrendingOnly, filters, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 rajdhani">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading events...</span>
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

  if (events.length === 0) {
    return (
      <div className="text-center py-12 rajdhani">
        <p className="text-gray-600 text-lg mb-4">No events found</p>
        <p className="text-gray-500">Try adjusting your search criteria or check back later for new events.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rajdhani">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
