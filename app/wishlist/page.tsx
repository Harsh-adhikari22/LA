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
      <main className="min-h-screen bg-black relative">
        <Navbar />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/contact_bg.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-[#d4af37] lit-affairs-font mb-4 drop-shadow-[0_0_16px_rgba(212,175,55,0.7)]">
              Error Loading Wishlist
            </h1>
            <p className="text-[#f2d47a] mb-6 lit-affairs-font">{error}</p>
            <Link href="/">
              <Button className="bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const hasWishlist = wishlistItems && wishlistItems.length > 0

  return (
    <main className="min-h-screen bg-black relative">
      <Navbar />

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/contact_bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-[#d4af37] text-[#d4af37]" />
            <h1 className="text-[42px] font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.7)]">
              My Wishlist
            </h1>
          </div>
          <p className="text-[26px] text-[#f2d47a] lit-affairs-font">Events you've liked and want to remember</p>
        </div>

        {!hasWishlist ? (
          <Card className="p-12 text-center bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <Heart className="w-16 h-16 text-[#d4af37]/60 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#f2d47a] mb-2 lit-affairs-font">Your wishlist is empty</h2>
            <p className="text-[#e6c768] mb-6 lit-affairs-font">
              Start adding events to your wishlist by clicking the heart icon
            </p>
            <Link href="/search">
              <Button
                size="lg"
                className="gap-2 bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              >
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
                    <Card className="overflow-hidden bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]">
                      {/* Image */}
                      <div className="relative h-56 overflow-hidden bg-black/50">
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
                        <div className="absolute inset-0 bg-black/50" />
                        {event.trending && (
                          <Badge className="absolute top-3 left-3 bg-[#d4af37] text-black hover:bg-[#d4af37]">Trending</Badge>
                        )}
                      </div>

                      {/* Stats Bar */}
                      <div className="px-3 py-1 border-t border-[#b88a22]/30 bg-black/60">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-[#f2d47a] text-sm line-clamp-1">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-[#e6c768]">
                              <Star className="w-3.5 h-3.5 text-[#d4af37] fill-current" />
                              <span>
                                {Number(event.rating)?.toFixed(1) ?? "—"} ({event.reviews_count ?? 0})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {event.actual_price && Number(event.actual_price) > Number(event.discounted_price) && (
                              <span className="text-xs text-[#d4af37]/60 line-through block">
                                ₹{Number(event.actual_price).toLocaleString()}
                              </span>
                            )}
                            <span className="text-base font-bold text-[#d4af37]">
                              ₹{Number(event.discounted_price ?? 0).toLocaleString()}
                            </span>
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
