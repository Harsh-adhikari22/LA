import { getEventById } from "@/lib/supabase/events"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { notFound } from "next/navigation"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { MapPin, Clock, Users, Star, Check, X, Calendar, Phone, Award, TrendingUpIcon as Trending, Link } from "lucide-react"

interface EventDetailPageProps {
  params: {
    id: string
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const pkg = await getEventById(params.id)

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

            {/* Package Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm animate-fade-in-up animate-delay-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    {pkg.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {pkg.location}
                      </div>
                    )}
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      <span className="text-gray-600">4.8 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                {pkg.category && (
                  <Badge variant="outline" className="text-sm">
                    {pkg.category}
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{pkg.description}</p>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up animate-delay-200">
              {pkg.duration_hours && (
                <Card className="py-6">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{pkg.duration_hours} Hours</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </CardContent>
                </Card>
              )}
              
              {pkg.event_date && (
                <Card className="py-6">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">{new Date(pkg.event_date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">Event Date</div>
                  </CardContent>
                </Card>
              )}

              {pkg.max_capacity && (
                <Card className="py-6">
                  <CardContent className="p-4 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold">Up to {pkg.max_capacity}</div>
                    <div className="text-sm text-gray-600">Group Size</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animate-delay-400">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <Card className="py-6">
                  <CardHeader>
                    <CardTitle className="text-green-600">What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pkg.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <Card className="py-6">
                  <CardHeader>
                    <CardTitle className="text-red-600">What's Not Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pkg.exclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-center">
                          <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="animate-scale-in animate-delay-200 py-6">
                <CardHeader>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Starting from</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-primary">
                        ₹{pkg.price?.toLocaleString() || "Contact"}
                      </span>
                    </div>
                    <Badge
                      variant={
                        pkg.is_available === true
                          ? "default"
                          : "destructive"
                      }
                      className="mt-2 capitalize"
                    >
                      {pkg.is_available === false
                        ? "Sold Out"
                        : "Available"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  <div className="space-y-3">
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
