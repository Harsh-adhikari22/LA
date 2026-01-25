"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

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

  const [api, setApi] = useState<any>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative overflow-hidden rounded-lg">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((img, idx) => (
            <CarouselItem key={idx}>
              <Image
                src={
                  img ||
                  `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(
                    title + " party event"
                  )}`
                }
                alt={`${title} image ${idx + 1}`}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              current === i ? "bg-white w-4" : "bg-white/50"
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
