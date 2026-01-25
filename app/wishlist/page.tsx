import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getUserWishlist } from "@/lib/supabase/wishlists"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Star, ArrowRight, Heart } from "lucide-react"
import { WishlistButton } from "@/components/wishlist-button"
import { WishlistAddToCartButton } from "@/components/wishlist-add-to-cart-button"
import { Badge } from "@/components/ui/badge"

export default async function WishlistPage() {
  // Get current user
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's wishlist
  const { data: wishlistItems, error } = await getUserWishlist()

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Wishlist</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const hasWishlist = wishlistItems && wishlistItems.length > 0

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">Events you've liked and want to remember</p>
        </div>

        {!hasWishlist ? (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding events to your wishlist by clicking the heart icon</p>
            <Link href="/search">
              <Button size="lg" className="gap-2">
                Browse Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => {
              const event = item.events
              if (!event) return null

              return (
                <div key={item.id} className="group">
                  <Link href={`/events/${event.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-200">
                        <Image
                          src={
                            event.image_url ||
                            `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(event.title + " party event")}`
                          }
                          alt={event.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {event.trending && (
                          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">Trending</Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                          <span className="text-sm text-gray-600">
                            {Number(event.rating)?.toFixed(1) ?? "—"} ({event.reviews_count ?? 0})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            {event.actual_price && Number(event.actual_price) > Number(event.discounted_price) && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{Number(event.actual_price).toLocaleString()}
                              </span>
                            )}
                            <div className="text-lg font-bold text-primary">
                              ₹{Number(event.discounted_price ?? 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>

                  {/* Wishlist Button */}
                  <div className="mt-2">
                    <WishlistButton
                      eventId={event.id}
                      isInWishlist={true}
                      isAuthenticated={true}
                    />
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-2">
                    <WishlistAddToCartButton 
                      eventId={event.id} 
                      price={Number(event.discounted_price ?? 0)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
