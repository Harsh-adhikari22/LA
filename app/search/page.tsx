"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EventGrid } from "@/components/event-grid"
import { Navbar } from "@/components/navbar"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

export default function SearchPage() {
  const router = useRouter()
  const params = useSearchParams()

  // Read ?q= and ?category= from URL if present
  const initialQuery = params.get("q") ?? ""
  const initialCategory = params.get("category") ?? ""

  const [search, setSearch] = useState(initialQuery)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sort, setSort] = useState<"low" | "high" | "none">("none")
  const [trending, setTrending] = useState(false)
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([])
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: initialQuery,
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 10000] as [number, number],
    trending: false,
  })

  const categoryDropdownRef = useRef<HTMLDivElement | null>(null)

  // Sync URL params when search or (single) category filter changes
  useEffect(() => {
    const parts: string[] = []
    if (search) parts.push(`q=${encodeURIComponent(search)}`)
    if (filters.categories.length === 1) {
      parts.push(`category=${filters.categories[0]}`)
    }
    const query = parts.length ? `?${parts.join("&")}` : ""
    router.replace(`/search${query}`)
  }, [search, filters.categories, router])

  // Load categories
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

  // Close category dropdown on outside click
  useEffect(() => {
    if (!isCategoryOpen) return
    const handleClick = (event: MouseEvent) => {
      if (!categoryDropdownRef.current) return
      if (!categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    window.addEventListener("mousedown", handleClick)
    return () => window.removeEventListener("mousedown", handleClick)
  }, [isCategoryOpen])

  const toggleCategory = (id: string) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(id)
      const nextCategories = exists ? prev.categories.filter((c) => c !== id) : [...prev.categories, id]
      return { ...prev, categories: nextCategories }
    })
  }

  const clearFilters = () => {
    setSearch("")
    setTrending(false)
    setPriceRange([0, 10000])
    setSort("none")
    setFilters({
      search: "",
      categories: [],
      trending: false,
      priceRange: [0, 10000],
    })
  }

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search,
      priceRange,
      trending,
    }))
  }

  const selectedCategoryLabels =
    filters.categories.length === 0
      ? "All categories"
      : filters.categories
          .map((id) => categories.find((c) => c.id === id)?.title)
          .filter(Boolean)
          .join(", ")

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search header */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-white rajdhani">
            Find the perfect <span className="text-primary">LitAffair</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 hero-body">
            Search across packages, events and experiences. Refine with categories, price and trending filters.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Birthday parties, weddings, corporate events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 text-base bg-black/40 border-white/10 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={applyFilters}
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-sm md:text-base"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-black/40 border-white/10 text-white py-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg rajdhani">Refine results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category multi-select dropdown */}
              <div className="space-y-1" ref={categoryDropdownRef}>
                <Label className="text-xs uppercase tracking-wide text-gray-400 rajdhani">
                  Categories
                </Label>
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((open) => !open)}
                  className="w-full inline-flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-left hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  <span className="truncate text-gray-100 flex-1 min-w-0">
                    {selectedCategoryLabels || "All categories"}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {filters.categories.length > 0 ? `${filters.categories.length} selected` : "Any"}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-gray-400 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute z-30 mt-2 w-full max-w-xs rounded-lg border border-white/10 bg-black/95 shadow-xl max-h-64 overflow-auto">
                    <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-300 rajdhani">
                        Select categories
                      </span>
                      {filters.categories.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              categories: [],
                            }))
                          }
                          className="text-[11px] text-primary hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="py-2">
                      {categories.length === 0 && (
                        <p className="px-3 py-2 text-xs text-gray-500">Loading categories...</p>
                      )}
                      {categories.map((c) => {
                        const checked = filters.categories.includes(c.id)
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => toggleCategory(c.id)}
                            className="w-full px-3 py-2 flex items-center gap-2 text-sm text-gray-100 hover:bg-white/5"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleCategory(c.id)}
                              className="border-white/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <span className="truncate">{c.title}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price range slider */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-gray-400 rajdhani">
                  Price range (₹)
                </Label>
                <div className="px-1 pt-1">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    min={0}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Sort by price */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-gray-400 rajdhani">
                  Sort by price
                </Label>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as "low" | "high" | "none")}
                >
                  <SelectTrigger className="bg-black/40 border-white/10 text-sm">
                    <SelectValue placeholder="No sorting" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/10 text-sm text-white">
                    <SelectItem value="none">No sorting</SelectItem>
                    <SelectItem value="low">Low → High</SelectItem>
                    <SelectItem value="high">High → Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trending */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-gray-400 rajdhani">
                  Trending
                </Label>
                <div className="flex items-center justify-between rounded-lg border border-white/20 bg-black/70 px-3 py-2">
                  <span className="text-sm text-gray-100">Show trending only</span>
                  <Switch
                    checked={trending}
                    onCheckedChange={(value) => setTrending(Boolean(value))}
                    className="bg-gray-500 data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Filter actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="sm"
                onClick={applyFilters}
                className="bg-primary hover:bg-primary/90 text-xs md:text-sm"
              >
                Apply filters
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="border-white/20 text-gray-200 hover:bg-white/50 text-xs md:text-sm"
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mt-2">
          <EventGrid filters={filters} sort={sort} />
        </div>
      </div>
    </div>
  )
}
