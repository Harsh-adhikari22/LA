"use server"

import { createClient } from "./server"

export async function addToWishlist(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in to add to wishlist" }
    }

    // Check if event exists
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .single()

    if (eventError || !eventData) {
      return { success: false, error: "Event not found" }
    }

    // Add to wishlist
    const { error } = await supabase.from("wishlists").insert([
      {
        event_id: eventId,
        user_id: user.id,
      },
    ])

    if (error) {
      console.error("Error adding to wishlist:", error)
      if (error.code === "23505") {
        return { success: false, error: "Event already in your wishlist" }
      }
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { success: false, error: "Failed to add to wishlist" }
  }
}

export async function removeFromWishlist(eventId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in to remove from wishlist" }
    }

    // Remove from wishlist
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error removing from wishlist:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, error: "Failed to remove from wishlist" }
  }
}

export async function isEventInWishlist(eventId: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data } = await supabase
      .from("wishlists")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single()

    return !!data
  } catch {
    return false
  }
}

export async function getUserWishlist() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: [], error: "Not authenticated" }
    }

    // First, fetch wishlist items
    const { data: wishlistItems, error: wishlistError } = await supabase
      .from("wishlists")
      .select("id, event_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (wishlistError) {
      console.error("Error fetching wishlist:", wishlistError)
      return { data: [], error: wishlistError.message }
    }

    if (!wishlistItems || wishlistItems.length === 0) {
      return { data: [], error: null }
    }

    // Get all event IDs from wishlist
    const eventIds = wishlistItems.map((item) => item.event_id)

    // Fetch event details for all events in wishlist
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(`
        id,
        title,
        description,
        image_url,
        discounted_price,
        actual_price,
        rating,
        reviews_count,
        trending,
        categories (id, title)
      `)
      .in("id", eventIds)

    if (eventsError) {
      console.error("Error fetching events:", eventsError)
      return { data: [], error: eventsError.message }
    }

    // Combine wishlist items with event details, maintaining order
    const combinedData = wishlistItems.map((item) => ({
      id: item.id,
      event_id: item.event_id,
      created_at: item.created_at,
      events: events?.find((e) => e.id === item.event_id),
    }))

    return { data: combinedData, error: null }
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return { data: [], error: "Failed to fetch wishlist" }
  }
}
