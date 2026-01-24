"use client"

import { Star } from "lucide-react"
import { Review } from "@/lib/supabase/events"
import { Card } from "@/components/ui/card"

interface ReviewsSectionProps {
  reviews: Review[]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`

  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Comments</h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900">
                  {review.profiles?.full_name || "Anonymous"}
                </div>
                <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {review.review && (
              <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
            )}
          </Card>
        ))}
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 pt-6 border-t text-center">
          <button className="text-primary hover:underline font-medium text-sm">
            View all {reviews.length} reviews
          </button>
        </div>
      )}
    </div>
  )
}
