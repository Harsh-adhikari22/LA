"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"

interface EventCarouselProps {
  title: string
  hero: string
  images?: string[]
  isTrending?: boolean
}

export default function EventCarousel({
  title,
  hero,
  images = [],
  isTrending,
}: EventCarouselProps) {
  const slides = [hero, ...(Array.isArray(images) ? images : [])].filter(Boolean)

  const [current, setCurrent] = useState(0)
  const [unblurIndex, setUnblurIndex] = useState<number | null>(0)
  const [isUnblurring, setIsUnblurring] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 3500)
    return () => window.clearInterval(id)
  }, [slides.length])

  useEffect(() => {
    setUnblurIndex(current)
    setIsUnblurring(true)
    const t = window.setTimeout(() => setIsUnblurring(false), 350)
    return () => window.clearTimeout(t)
  }, [current])

  const goTo = (index: number) => {
    if (index < 0) {
      setCurrent(slides.length - 1)
      return
    }
    if (index >= slides.length) {
      setCurrent(0)
      return
    }
    setCurrent(index)
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative w-full h-64 md:h-96">
        {slides.map((img, idx) => {
          const isActive = idx === current
          const isUnblurTarget = isUnblurring && unblurIndex === idx
          return (
            <Image
              key={idx}
              src={
                img ||
                `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(
                  title + " party event"
                )}`
              }
              alt={`${title} image ${idx + 1}`}
              width={800}
              height={400}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                isActive ? "opacity-100" : "opacity-0"
              } ${isActive && isUnblurTarget ? "blur-md" : isActive ? "blur-0" : "blur-md"}`}
              priority={idx === 0}
            />
          )
        })}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full border border-[#b88a22]/60 bg-black text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)] hover:bg-[#d4af37] hover:text-black transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="mx-auto h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full border border-[#b88a22]/60 bg-black text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.4)] hover:bg-[#d4af37] hover:text-black transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="mx-auto h-4 w-4" />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              current === i ? "bg-[#d4af37] w-4 shadow-[0_0_10px_rgba(212,175,55,0.8)]" : "bg-[#f2d47a]/50"
            }`}
          />
        ))}
      </div>

      {/* Trending */}
      {isTrending && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            <Trending className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}
    </div>
  )
}
