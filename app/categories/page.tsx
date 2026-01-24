"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { PackageFilters } from "@/components/package-filters"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Star, DollarSign } from "lucide-react"
import { EventGrid } from "@/components/event-grid"
import { CategoryGrid } from "@/components/category-grid"

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  trending: boolean
}

export default function PlansPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    priceRange: [0, 10000],
    trending: false,
  })

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const planCategories = [
    {
      id: "trending",
      title: "Trending Events",
      description: "Most popular events this month",
      icon: TrendingUp,
      filters: { ...filters, trending: true },
    },
    {
      id: "premium",
      title: "Premium Events",
      description: "High-End events for Exclusive Experiences",
      icon: Star,
      filters: { ...filters, priceRange: [2000, 10000] as [number, number] },
    },
    {
      id: "budget",
      title: "Budget Friendly",
      description: "Affordable event options",
      icon: DollarSign,
      filters: { ...filters, priceRange: [0, 1000] as [number, number] },
    },
  ]

  return (
    <main className="min-h-screen bg-transparent">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 rajdhani">
        <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://jlvrbkracqwczuzbzrdb.supabase.co/storage/v1/object/public/videos/Skyline.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 fancy-adventure text-black">Categories</h1>
          <p className="text-lg md:text-xl text-black rajdhani font-semibold">Choose from multiple categories catered to your liking</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 font-semibold">
              <div className="lg:col-span-1 font-semibold">
                <PackageFilters onFiltersChange={handleFiltersChange} />
              </div>
              <div className="lg:col-span-3">
                <CategoryGrid filters={filters} />
              </div>
            </div>
          </TabsContent>

          {planCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <Card className="py-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className="w-6 h-6 mr-2 text-primary" />
                    {category.title}
                  </CardTitle>
                  <p className="text-gray-600 font-semibold">{category.description}</p>
                </CardHeader>
              </Card>
              <CategoryGrid filters={category.filters} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <WhatsAppButton />
    </main>
  )
}
