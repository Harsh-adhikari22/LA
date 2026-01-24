"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, IndianRupeeIcon, Link, Eye } from "lucide-react"

interface Categories {
  id: string
  title: string
}

interface EventJoinCategories {
  id: string
  title: string
  discounted_price: number
  actual_price: number
  rating: number
  reviews_count: number
  category: string
  image_url: string
  trending: boolean
  categories: Categories | null
}

interface EventCardProps {
  event: EventJoinCategories
}

export function EventCard({ event: event}: EventCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={
              event.image_url
            }
            alt={event.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {event.trending && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {event.categories?.title && (
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {event.categories?.title ?? "Uncategorized"}
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <IndianRupeeIcon className="w-4 h-4 mr-1 text-primary" />
            <span className="ml-2 line-through text-gray-500">{event.actual_price}</span>
            <span>{event.discounted_price}</span>
          </div>
          {event.reviews_count > 0 ? (
          <div>
            <Star className="w-4 h-4 mr-1 text-yellow-500 inline-block" />
            <span className="text-sm text-gray-600">{event.rating} ({event.reviews_count} reviews)</span>
          </div>):
          (<div className="text-sm text-gray-500">
            No reviews yet
          </div>)}    
        </div>
        <a href={`/events/${event.id}`} className="no-underline">
          <Button variant="ghost" className="mt-4 px-0">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}
