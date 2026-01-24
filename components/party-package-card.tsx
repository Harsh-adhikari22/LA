"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Star, Heart, MessageCircle, IndianRupeeIcon } from "lucide-react"

interface PartyPackage {
  id: string
  title: string
  description: string
  price: number
  duration_hours: number
  max_capacity: number
  available_spots: number
  category: string
  location: string
  event_date: string
  image_url: string
  gallery_urls: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: any
  is_trending: boolean
  is_available: boolean
}

interface PartyPackageCardProps {
  package: PartyPackage
  onBookNow?: (packageId: string) => void
  onViewDetails?: (packageId: string) => void
}

export function PartyPackageCard({ package: pkg, onBookNow, onViewDetails }: PartyPackageCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const handleBookNow = () => {
    onBookNow?.(pkg.id)
  }

  const handleViewDetails = () => {
    onViewDetails?.(pkg.id)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in the "${pkg.title}" party package at ${pkg.location}. Can you provide more details about pricing, availability, and what's included?`
    const whatsappUrl = `https://wa.me/+919667179269?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <Image
            src={
              pkg.image_url ||
              `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(pkg.title + " party event") || "/placeholder.svg"}`
            }
            alt={pkg.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {pkg.is_trending && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          )}
          {pkg.category && (
            <Badge variant="secondary" className="bg-white/90 text-gray-700">
              {pkg.category}
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
              {pkg.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{pkg.description}</p>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-primary" />
            <span>{pkg.location}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-primary" />
              <span>{pkg.duration_hours} hours</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-primary" />
              <span>Up to {pkg.max_capacity} guests</span>
            </div>
          </div>

          {pkg.event_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1 text-primary" />
              <span>{formatDate(pkg.event_date)}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <IndianRupeeIcon className="w-4 h-4 mr-1 text-primary" />
            <span>Starting from Rs {pkg.price}</span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center justify-between">
            <div className={`text-sm font-medium ${pkg.is_available ? "text-green-600" : "text-red-600"}`}>
              {pkg.is_available ? "Available" : "Sold Out"}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" onClick={handleViewDetails} className="flex-1">
          View Details
        </Button>
        <a href="/contact">
        <Button disabled={!pkg.is_available} className="flex-1 bg-primary hover:bg-primary/90">
          {pkg.is_available ? "Contact Us" : "Sold Out"}
        </Button>
        </a>
        <Button
          variant="outline"
          size="icon"
          onClick={handleWhatsAppInquiry}
          className="bg-green-50 border-green-200 hover:bg-green-100"
        >
          <MessageCircle className="w-4 h-4 text-green-600" />
        </Button>
      </CardFooter>
    </Card>
  )
}
