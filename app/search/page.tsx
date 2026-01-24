"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EventGrid } from "@/components/event-grid"
import { Navbar } from "@/components/navbar"
import { supabase } from "@/lib/supabase/client"
import { Checkbox } from "@radix-ui/react-checkbox"

export default function SearchPage() {
  const router = useRouter()
  const params = useSearchParams()

  // Read ?q= from URL if present
  const initialQuery = params.get("q") ?? ""
  const initialCategory = params.get("category") ?? ""

  const [search, setSearch] = useState(initialQuery)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sort, setSort] = useState<"low" | "high" | "none">("none")
  const [trending, setTrending] = useState(false)
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([])

  const [filters, setFilters] = useState({
    search: initialQuery,
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 10000] as [number, number],
    trending: false,
  })

  // Sync URL params when search or category changes (? required before first param)
  useEffect(() => {
    const parts: string[] = []
    if (search) parts.push(`q=${encodeURIComponent(search)}`)
    if (initialCategory) parts.push(`category=${initialCategory}`)
    const query = parts.length ? `?${parts.join("&")}` : ""
    router.replace(`/search${query}`)
  }, [search, initialCategory])


  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title")
        .order("title")

      if (!error && data) setCategories(data)
    }

    loadCategories()
  }, [])

  return (
    <div className="max-w-8xl mx-auto">
      <Navbar/>
      <div className="px-6 py-6 flex flex-col gap-6">
      {/* SEARCH BAR */}
      <div className="flex items-center gap-3">
  <input
    type="text"
    placeholder="Search events..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full border rounded-lg px-4 py-2"
  />

  <button
    onClick={() =>
      setFilters(prev => ({
        ...prev,
        search,                // apply search text
        priceRange,            // keep latest price range
        trending,              // keep trending state
        categories: prev.categories
      }))
    }
    className="px-4 py-2 bg-primary text-white rounded-lg"
  >
    Search
  </button>
</div>

      {/* FILTERS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Price Range */}
        <div className="border rounded-lg p-3">
          <p className="font-semibold mb-2">Price Range</p>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={priceRange[0]}
              min={0}
              onChange={(e) =>
                setPriceRange([+e.target.value, priceRange[1]])
              }
              className="border rounded px-2 py-1 w-full"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              min={0}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value])
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="border rounded-lg p-3">
          <p className="font-semibold mb-2">Sort by Price</p>
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value as "low" | "high" | "none")
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="none">None</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>

        {/* Category */}
        <div className="border rounded-lg p-3">
          <p className="font-semibold mb-2">Category</p>
          <select
            multiple
            value={filters.categories}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                categories: Array.from(e.target.selectedOptions, opt => opt.value)
              }))
            }
            className="border rounded px-3 py-2 w-full h-40"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Trending */}
        <div className="border rounded-lg p-3">
          <p className="font-semibold mb-2">Trending</p>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={trending}
              onChange={(e) => setTrending(e.target.checked)}
            />
            Trending only
          </label>
        </div>
      </div>

    <div className="flex gap-3 mt-4">

      <button
        onClick={() =>
          setFilters({
            search,
            categories: filters.categories,
            priceRange,
            trending,
          })
        }
        className="px-4 py-2 bg-primary text-white rounded-lg"
      >
        Apply Filters
      </button>

      <button
        onClick={() => {
          setSearch("")
          setTrending(false)
          setPriceRange([0, 10000])
          setFilters({
            search: "",
            categories: [],
            trending: false,
            priceRange: [0, 10000],
          })
        }}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        Clear Filters
      </button>

    </div>


      {/* EVENT GRID */}
      <EventGrid filters={filters} sort={sort} />
    </div>
    </div>
  )
}
