"use client"

import { Star } from "lucide-react"
import { StarDistribution } from "@/lib/supabase/events"

interface StarDistributionChartProps {
  distribution: StarDistribution[]
  totalReviews: number
  averageRating: number
}

export function StarDistributionChart({
  distribution,
  totalReviews,
  averageRating,
}: StarDistributionChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      {totalReviews === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews yet. Be the first to review this event!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">{totalReviews} reviews</div>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const data = distribution.find((d) => d.stars === stars)
              if (!data) return null

              return (
                <div key={stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm text-gray-700 font-medium">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm text-gray-600">{data.count}</span>
                    <span className="text-xs text-gray-500">({data.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
