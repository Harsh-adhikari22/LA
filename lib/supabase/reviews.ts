"use server"

import { createClient } from "./server"

export interface SubmitReviewData {
  event_id: string
  stars: number
  review: string
}

export async function submitReview(data: SubmitReviewData): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user and server client
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in to submit a review" }
    }

    // Validate event exists
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", data.event_id)
      .single()

    if (eventError || !eventData) {
      return { success: false, error: "Event not found" }
    }

    // Insert the review using server client (with admin privileges)
    const { error } = await supabase.from("reviews").insert([
      {
        event_id: data.event_id,
        user_id: user.id,
        stars: data.stars,
        review: data.review || null,
      },
    ])

    if (error) {
      console.error("Error submitting review:", error)
      // Handle unique constraint violation
      if (error.code === "23505") {
        return { success: false, error: "You have already reviewed this event" }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting review:", error)
    return { success: false, error: "Failed to submit review" }
  }
}
