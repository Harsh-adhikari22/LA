"use client"

import { useEffect, useState } from "react"
import { PartyPackageCard } from "./party-package-card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface PartyPackage {
  id: string
  title: string
  description: string
  price: number
  duration_hours: number
  max_capacity: number
  available_spots: number
  category: string
  location: string
  event_date: string
  image_url: string
  gallery_urls: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: any
  is_trending: boolean
  is_available: boolean
}

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  duration: string
  availability: string
  trending: boolean
}

interface PartyPackageGridProps {
  searchQuery?: string
  category?: string
  limit?: number
  showTrendingOnly?: boolean
  filters?: FilterState
}

export function PartyPackageGrid({ searchQuery, category, limit, showTrendingOnly, filters }: PartyPackageGridProps) {
  const [packages, setPackages] = useState<PartyPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from("party_packages")
          .select("*")
          .eq("is_available", true)
          .order("created_at", { ascending: false })

        if (filters) {
          // Search query filter
          if (filters.search) {
            query = query.or(
              `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,description.ilike.%${filters.search}%,category.ilike.%${filters.search}%`,
            )
          }

          // Category filter
          if (filters.category && filters.category !== "all") {
            query = query.eq("category", filters.category)
          }

          // Price range filter
          if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
            query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1])
          }

          // Duration filter (in hours for parties)
          if (filters.duration && filters.duration !== "any") {
            switch (filters.duration) {
              case "1-3":
                query = query.gte("duration_hours", 1).lte("duration_hours", 3)
                break
              case "4-7":
                query = query.gte("duration_hours", 4).lte("duration_hours", 7)
                break
              case "8-14":
                query = query.gte("duration_hours", 8).lte("duration_hours", 14)
                break
              case "15+":
                query = query.gte("duration_hours", 15)
                break
            }
          }

          // Availability filter
          if (filters.availability && filters.availability !== "all") {
            if (filters.availability === "available") {
              query = query.gt("available_spots", 0)
            } else if (filters.availability === "limited") {
              query = query.gt("available_spots", 0).lte("available_spots", 5)
            }
          }

          // Trending filter
          if (filters.trending) {
            query = query.eq("is_trending", true)
          }
        } else {
          // Legacy search support
          if (searchQuery) {
            query = query.or(
              `title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
            )
          }

          if (category) {
            query = query.eq("category", category)
          }

          if (showTrendingOnly) {
            query = query.eq("is_trending", true)
          }
        }

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) throw error

        setPackages(data || [])
      } catch (err) {
        console.error("Error fetching packages:", err)
        setError("Failed to load party packages")
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [searchQuery, category, limit, showTrendingOnly, filters, supabase])

  const handleBookNow = (packageId: string) => {
    router.push(`/booking/${packageId}`)
  }

  const handleViewDetails = (packageId: string) => {
    router.push(`/packages/${packageId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 rajdhani">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading party packages...</span>
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

  if (packages.length === 0) {
    return (
      <div className="text-center py-12 rajdhani">
        <p className="text-gray-600 text-lg mb-4">No party packages found</p>
        <p className="text-gray-500">Try adjusting your search criteria or check back later for new packages.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rajdhani">
      {packages.map((pkg) => (
        <PartyPackageCard key={pkg.id} package={pkg} onBookNow={handleBookNow} onViewDetails={handleViewDetails} />
      ))}
    </div>
  )
}
