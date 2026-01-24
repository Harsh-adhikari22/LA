"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
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
        "group relative h-56 w-full cursor-pointer rounded-xl shadow-sm [perspective:1000px]"
      )}
      onClick={() =>
        router.push(`/search?category=${pkg.id}&q=${encodeURIComponent(pkg.title)}`)
      }
    >
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 h-full w-full rounded-xl overflow-hidden [backface-visibility:hidden]">
          <img
            src={pkg.image_url}
            alt={pkg.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-4 left-4 right-4 text-white text-lg font-semibold">
            {pkg.title}
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-card text-card-foreground p-4 text-sm leading-relaxed [transform:rotateY(180deg)] [backface-visibility:hidden] flex items-center justify-center text-center">
          {pkg.description}
        </div>
      </div>
    </div>
  )
}
