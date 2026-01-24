"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { PartyPackageGrid } from "@/components/party-package-grid"
import { PackageFilters } from "@/components/package-filters"
import { WhatsAppButton } from "@/components/whatsapp-button"

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  duration: string
  availability: string
  trending: boolean
}

export default function PackagesPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceRange: [0, 10000],
    duration: "",
    availability: "",
    trending: false,
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Party Packages</h1>
          <p className="text-lg md:text-xl text-gray-600">Explore our complete collection of party planning packages</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <PackageFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            <PartyPackageGrid filters={filters} />
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </main>
  )
}
