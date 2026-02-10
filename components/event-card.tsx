"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, IndianRupeeIcon } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"
import { createClient } from "@/lib/supabase/client"
import { isEventInWishlist } from "@/lib/supabase/wishlists"

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
  const [user, setUser] = useState<any>(null)
  const [inWishlist, setInWishlist] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const wishlistStatus = await isEventInWishlist(event.id)
        setInWishlist(wishlistStatus)
      }
    }
    getUser()
  }, [event.id, supabase.auth])

  const goToDetails = () => {
    router.push(`/events/${event.id}`)
  }

  return (
    <Card
      className="group relative overflow-hidden border-transparent bg-transparent hover:-translate-y-1 transition-all duration-300 animate-scale-in cursor-pointer hover:shadow-[0_0_45px_rgba(212,175,55,0.75)]"
      onClick={goToDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          goToDetails()
        }
      }}
    >
      {/* Full-card blurred image-based background with dark offset */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="w-full h-full scale-110"
          style={{
            backgroundImage: `url(${event.image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(18px)",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={
              event.image_url
            }
            alt={event.title}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/40" />
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

        {/* Wishlist Button */}
        <div
          className="absolute top-3 right-3"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <WishlistButton
            eventId={event.id}
            isInWishlist={inWishlist}
            isAuthenticated={!!user}
            onWishlistChange={(newStatus) => setInWishlist(newStatus)}
          />
        </div>
      </div>

      <CardContent className="relative z-10 p-4 text-white">
        <div className="relative space-y-3">
          <div>
            <h3 className="font-bold text-3xl text-white line-clamp-2 lit-affairs-font group-hover:text-[#d4af37] transition-colors">
              {event.title}
            </h3>
          </div>

          {/* Prices */}
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              {/* Discounted price (highlighted) */}
              <span className="inline-flex items-center gap-1 text-base md:text-lg font-bold text-black bg-[#FFD700] px-2.5 py-1 rounded-md shadow-[0_0_16px_rgba(255,215,0,0.85)]">
                <IndianRupeeIcon className="w-4 h-4 text-black" />
                {event.discounted_price}
              </span>

              {/* Actual price (strikethrough, smaller than discounted) */}
              <span className="text-base font-semibold text-white/70 line-through">
                ₹{event.actual_price}
              </span>
            </div>
            {event.actual_price > event.discounted_price && (
              <span className="text-sm font-semibold text-emerald-50 bg-emerald-500/90 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)]">
                Save ₹{event.actual_price - event.discounted_price}
              </span>
            )}
          </div>

          {event.reviews_count > 0 ? (
            <div>
              <Star className="w-4 h-4 mr-1 text-yellow-500 inline-block" />
              <span className="text-sm text-white/80">
                {event.rating} ({event.reviews_count} reviews)
              </span>
            </div>
          ) : (
            <div className="text-sm text-white/70">No reviews yet</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
