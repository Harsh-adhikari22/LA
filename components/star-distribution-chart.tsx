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
    <div className="bg-black/60 border border-[#b88a22]/40 rounded-2xl p-6 shadow-[0_0_26px_rgba(212,175,55,0.2)] backdrop-blur-md rajdhani">
      <h2 className="text-2xl font-bold text-[#f2d47a] lit-affairs-font mb-6">Customer Reviews</h2>

      {totalReviews === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#c9a949]">No reviews yet. Be the first to review this event!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="flex items-center gap-4 pb-6 border-b border-[#b88a22]/40">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-[#f2d47a]">{averageRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? "fill-[#d4af37] text-[#d4af37]"
                        : "text-[#4b3a12]"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-[#c9a949] mt-2">{totalReviews} reviews</div>
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
                    <span className="text-sm text-[#f2d47a] font-medium">{stars}</span>
                    <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  </div>

                  <div className="flex-1 h-2 bg-[#2b1d05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2d47a] transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm text-[#c9a949]">{data.count}</span>
                    <span className="text-xs text-[#8f7326]">({data.percentage.toFixed(0)}%)</span>
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
