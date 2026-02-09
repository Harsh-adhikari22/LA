"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CategoryCard {
  id: string
  title: string
  description: string
  image_url: string
}

interface CategoryCardProps {
  category: CategoryCard
  onViewProducts?: (packageId: string) => void
}

export function CategoryCard({ category: pkg, onViewProducts }: CategoryCardProps) {
  const router = useRouter()
  const handleViewProducts = () => {
    onViewProducts?.(pkg.id)
  }

  return (
    <div
      className={cn(
        "group relative h-56 w-full cursor-pointer rounded-2xl bg-white/5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-300 transform-gpu hover:scale-[1.06] hover:z-10 hover:shadow-[0_0_0_5px_rgba(212,175,55,0.95),0_0_40px_rgba(212,175,55,0.9)]"
      )}
      onClick={() =>
        router.push(`/search?category=${pkg.id}&q=${encodeURIComponent(pkg.title)}`)
      }
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <img
          src={pkg.image_url}
          alt={pkg.title}
          className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:blur-sm group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/70 transition-colors duration-500 group-hover:bg-black/80" />
      </div>

      {/* Title (default) */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 transition-opacity duration-300 group-hover:opacity-0">
        <span
          className="lit-affairs-font text-[60px] font-bold leading-tight text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
          style={{
            backgroundImage: `url(${pkg.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitTextStroke: "1px rgba(255,255,255,0.9)",
          }}
        >
          {pkg.title}
        </span>
      </div>

      {/* Description (hover) */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="lit-affairs-font font-bold text-[24px] text-[#d4af37] drop-shadow-[0_0_18px_rgba(212,175,55,0.75)]">
          {pkg.description}
        </p>
      </div>
    </div>
  )
}
