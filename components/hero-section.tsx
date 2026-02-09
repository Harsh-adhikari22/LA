"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import '../app/globals.css'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-black/70 overflow-hidden py-16 md:py-24">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/Video_Generation_Ace_Card_and_Balloons.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/70" />

      {/* Optional overlay to make text readable */}
      {/* <div className="absolute inset-0 bg-white/30"></div> */}
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#d4af37] rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#d4af37] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#d4af37] rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="mb-6">
            <span className="lit-affairs-font block text-[clamp(2.75rem,6vw,4.5rem)] text-[#d4af37] drop-shadow-[0_0_20px_rgba(212,175,55,0.75)]">
              This night we indulge in
            </span>
            <span className="lit-affairs-font block text-[clamp(4rem,10vw,7rem)] text-[#d4af37] drop-shadow-[0_0_30px_rgba(212,175,55,0.9)] -mt-2">
              Lit Affairs
            </span>
          </h1>
          <div className="w-full mb-8">
            <div className="bg-black/60 backdrop-blur-md py-4 px-6 rounded-xl shadow-[0_0_28px_rgba(212,175,55,0.35)]">
              <p className="text-[clamp(1.15rem,2.5vw,1.7rem)] text-[#f2d47a] max-w-4xl mx-auto lit-affairs-font text-center drop-shadow-[0_0_16px_rgba(212,175,55,0.35)]">
                Undying nights, unforgettable stories. Embark on a journey where every moment is a LitAffair.
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="animate-slide-up">
          <form
            onSubmit={handleSearch}
            className="bg-black/60 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.25)] backdrop-blur-lg border border-[#b88a22]/40 p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4af37] w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Birthday parties, weddings, corporate events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-lg border-0 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus:ring-2 focus:ring-[#d4af37] hero-body"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-black/80"
              >
                <Search className="w-5 h-5 mr-2 text-[#d4af37]" />
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-8 h-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#f2d47a] hero-subheading">Serving</h3>
              <p className="text-[#e6c768] hero-body">Delhi, Delhi NCR</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#f2d47a] hero-subheading">100+</h3>
              <p className="text-[#e6c768] hero-body">Party packages and decors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-bold text-[#f2d47a] hero-subheading">10K+</h3>
              <p className="text-[#e6c768] hero-body">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
