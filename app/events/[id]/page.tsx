import { getEventById } from "@/lib/supabase/events"
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

interface EventDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const pkg = await getEventById(id)
  
  // Get current user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!pkg) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative overflow-hidden rounded-lg animate-fade-in-up">
              <Image
                src={
                  pkg.image_url ||
                  `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(pkg.title + " party event") || "/placeholder.svg"}`
                }
                alt={pkg.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {pkg.is_trending && (
                  <Badge className="bg-red-500 text-white hover:bg-red-600">
                    <Trending className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm animate-fade-in-up animate-delay-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="text-gray-600">
                        {Number(pkg.rating)?.toFixed(1) ?? "—"} ({pkg.reviews_count ?? 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                {pkg.categories?.title && (
                  <Badge variant="outline" className="text-sm">
                    {pkg.categories.title}
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{pkg.description}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="animate-scale-in animate-delay-200 py-6">
                <CardHeader>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Starting from</p>
                    <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                      {pkg.actual_price != null && Number(pkg.actual_price) > Number(pkg.discounted_price) && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{Number(pkg.actual_price).toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary">
                        ₹{Number(pkg.discounted_price ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  <div className="space-y-3">
                    <AddToCartButton eventId={id} price={Number(pkg.discounted_price ?? 0)} userId={user?.id} />
                    <a href="/contact">
                      <Button variant="outline" className="w-full bg-transparent">
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Us
                      </Button>
                    </a>
                  </div>
                  <Separator />
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
