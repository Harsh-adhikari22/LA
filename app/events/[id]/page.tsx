import { getEventById, getEventReviews, getStarDistribution } from "@/lib/supabase/events"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { notFound } from "next/navigation"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Star, Phone, TrendingUpIcon as Trending } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { createClient } from "@/lib/supabase/server"
import { StarDistributionChart } from "@/components/star-distribution-chart"
import { ReviewsSection } from "@/components/reviews-section"
import { ReviewForm } from "@/components/review-form"
import EventCarousel from "@/components/EventCarousel"

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const pkg = await getEventById(id)
  
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch reviews and star distribution
  const reviews = await getEventReviews(id)
  const starDistribution = await getStarDistribution(id)
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    : 0

  const images = [pkg.image_url, ...(pkg.additional_images || [])].filter(Boolean)


  if (!pkg) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black rajdhani">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden animate-fade-in-up border border-[#b88a22]/40 shadow-[0_0_35px_rgba(212,175,55,0.25)]">
              <EventCarousel
                title={pkg.title}
                hero={pkg.image_url}
                images={pkg.additional_images}
                isTrending={pkg.is_trending}
              />
            
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {pkg.is_trending && (
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    <Trending className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
            </div>


            {/* Event Info */}
            <div className="bg-black/60 border border-[#b88a22]/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.2)] backdrop-blur-md animate-fade-in-up animate-delay-100 rajdhani">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#f2d47a] lit-affairs-font mb-2">
                    {pkg.title}
                  </h1>
                  <div className="flex items-center gap-4 text-[#c9a949]">
                    <div className="flex items-center text-[#d4af37]">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="text-[#c9a949]">
                        {Number(pkg.rating)?.toFixed(1) ?? "—"} ({pkg.reviews_count ?? 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                {pkg.categories?.title && (
                  <Badge variant="outline" className="text-sm border-[#b88a22]/60 text-[#f2d47a]">
                    {pkg.categories.title}
                  </Badge>
                )}
              </div>

              <p className="text-[#e6c768] text-lg leading-relaxed">{pkg.description}</p>
            </div>

            {/* Star Distribution Chart */}
            <StarDistributionChart 
              distribution={starDistribution}
              totalReviews={reviews.length}
              averageRating={averageRating}
            />

            {/* Reviews Section */}
            <ReviewsSection reviews={reviews} />

            {/* Review Form */}
            <ReviewForm 
              eventId={id}
              isAuthenticated={!!user}
            />
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rajdhani">
              <Card className="animate-scale-in animate-delay-200 py-6 bg-black/60 border border-[#b88a22]/40 shadow-[0_0_28px_rgba(212,175,55,0.2)] backdrop-blur-md">
                <CardHeader>
                  <div className="text-center">
                    <p className="text-sm text-[#c9a949]">Starting from</p>
                    <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                      {pkg.actual_price != null && Number(pkg.actual_price) > Number(pkg.discounted_price) && (
                        <span className="text-lg text-[#c9a949] line-through">
                          ₹{Number(pkg.actual_price).toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-[#d4af37] drop-shadow-[0_0_14px_rgba(212,175,55,0.6)]">
                        ₹{Number(pkg.discounted_price ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator className="bg-[#b88a22]/40" />
                  <div className="space-y-3">
                    <AddToCartButton eventId={id} price={Number(pkg.discounted_price ?? 0)} userId={user?.id} />
                    <a href="/contact">
                      <Button
                        variant="outline"
                        className="w-full bg-black text-[#d4af37] border border-[#b88a22]/60 hover:bg-[#d4af37] hover:text-black"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Us
                      </Button>
                    </a>
                  </div>
                  <Separator className="bg-[#b88a22]/40" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton/>
    </main>
  )
}
