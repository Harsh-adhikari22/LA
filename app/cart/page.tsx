"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { PartyPackageGrid } from "@/components/party-package-grid"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Destination {
  destination: string
  count: number
}

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  duration: string
  availability: string
  trending: boolean
}

export default function PlacesPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceRange: [0, 10000],
    duration: "",
    availability: "",
    trending: false,
  })

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data, error } = await supabase
          .from("party_packages")
          .select("location")
          .eq("is_available", true)
          .not("location", "is", null)

        if (error) throw error

        // Count packages per location
        const locationCounts = data.reduce(
          (acc, item) => {
            const loc = item.location
            acc[loc] = (acc[loc] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const locationList = Object.entries(locationCounts)
          .map(([location, count]) => ({ destination: location, count }))
          .sort((a, b) => b.count - a.count)

        setDestinations(locationList)
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [supabase])

  const handleDestinationClick = (destination: string) => {
    setSelectedDestination(destination)
    setFilters((prev) => ({ ...prev, search: destination }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, search: searchQuery }))
    setSelectedDestination("")
  }

  const filteredDestinations = destinations.filter((dest) =>
    dest.destination.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-[url('/CityLights.jpg')] bg-cover bg-fixed bg-center bg-no-repeat relative rajdhani">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4 fancy-adventure">Explore Locations</h1>
          <p className="text-lg md:text-xl text-gray-100 font-semibold">Discover party venues and locations</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10 text-lg placeholder:text-gray-300 font-semibold text-white bg-white/20 border-white/30 focus:ring-2 focus:ring-white/50"
              />
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 rajdhani font-semibold">
          {/* Destinations Sidebar */}
          <div className="lg:col-span-1">
            <Card className="py-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Popular Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedDestination("")
                        setFilters((prev) => ({ ...prev, search: "" }))
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedDestination === "" ? "bg-primary text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      All Locations
                    </button>
                    {filteredDestinations.map((dest) => (
                      <button
                        key={dest.destination}
                        onClick={() => handleDestinationClick(dest.destination)}
                        className={`w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between ${
                          selectedDestination === dest.destination ? "bg-primary text-white" : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="truncate">{dest.destination}</span>
                        <Badge
                          variant="secondary"
                          className={`ml-2 ${selectedDestination === dest.destination ? "bg-white/20 text-white" : ""}`}
                        >
                          {dest.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            {selectedDestination && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Packages in {selectedDestination}</h2>
                <p className="text-gray-600">
                  {destinations.find((d) => d.destination === selectedDestination)?.count} packages available
                </p>
              </div>
            )}
            <PartyPackageGrid filters={filters} />
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </main>
  )
}
