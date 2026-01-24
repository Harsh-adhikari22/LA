"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  trending: boolean
}

interface PackageFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
}

export function PackageFilters({ onFiltersChange, initialFilters }: PackageFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceRange: [0, 10000],
    trending: false,
    ...initialFilters,
  })

  const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("party_packages").select("category").not("category", "is", null)

      if (data) {
        const uniqueCategories = [...new Set(data.map((item) => item.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    }

    fetchCategories()
  }, [supabase])

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      priceRange: [0, 10000],
      trending: false,
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return value.length > 0
    if (key === "priceRange") return value[0] > 0 || value[1] < 10000
    if (key === "trending") return value === true
    return value !== ""
  }).length

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
          <Filter className="w-4 h-4 mr-2" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`${isOpen ? "block" : "hidden"} md:block py-4`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Filter Packages</CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search party types, locations..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Duration (Hours)</Label>
            <Select value={filters.duration} onValueChange={(value) => updateFilter("duration", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any duration</SelectItem>
                <SelectItem value="1-3">1-3 hours</SelectItem>
                <SelectItem value="4-7">4-7 hours</SelectItem>
                <SelectItem value="8-14">8-14 hours</SelectItem>
                <SelectItem value="15+">15+ hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select value={filters.availability} onValueChange={(value) => updateFilter("availability", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All packages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All packages</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="limited">Limited spots</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Trending */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="trending"
              checked={filters.trending}
              onChange={(e) => updateFilter("trending", e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="trending">Show trending only</Label>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="space-y-2">
              <Label>Active Filters</Label>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("search", "")} />
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.category}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("category", "")} />
                  </Badge>
                )}
                {filters.trending && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Trending
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("trending", false)} />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
