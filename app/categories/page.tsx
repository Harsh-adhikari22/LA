"use client"

import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CategoryGrid } from "@/components/category-grid"

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative min-h-[80vh] py-16 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/Categories_bg.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="lit-affairs-font text-[clamp(3rem,6vw,5rem)] text-[#d4af37] drop-shadow-[0_0_26px_rgba(212,175,55,0.9)]">
              Categories
            </h1>
            <p className="lit-affairs-font text-[clamp(1.5rem,3vw,2.5rem)] text-[#f2d47a] drop-shadow-[0_0_18px_rgba(212,175,55,0.7)]">
              Choose from multiple categories catered to your liking
            </p>
          </div>

          <CategoryGrid />
        </div>
      </section>

      <WhatsAppButton />
    </main>
  )
}
