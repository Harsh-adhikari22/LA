"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { submitReview } from "@/lib/supabase/reviews"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ReviewFormProps {
  eventId: string
  isAuthenticated: boolean
  onReviewSubmitted?: () => void
}

export function ReviewForm({ eventId, isAuthenticated, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitReview({
        event_id: eventId,
        stars: rating,
        review: reviewText,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Your review has been submitted successfully!",
        })
        setRating(0)
        setReviewText("")
        onReviewSubmitted?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Review</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Sign in to share your experience with this event</p>
          <Link href="/auth/login">
            <Button className="w-full sm:w-auto">Sign In to Review</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Review</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <Textarea
            id="review"
            placeholder="Share your experience with this event..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-24"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-2">{reviewText.length}/500 characters</p>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Card>
  )
}
