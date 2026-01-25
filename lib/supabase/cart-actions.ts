"use server"

import { createClient } from "./server"

export async function addToCartAction(eventId: string, price: number): Promise<{ success: boolean; error?: string; isNew?: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "You must be logged in to add to cart" }
    }

    // First, check if user has a cart, if not create one
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single()

    let cartId: string

    if (!cartData) {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select("id")
        .single()

      if (createError) throw createError
      cartId = newCart.id
    } else {
      cartId = cartData.id
    }

    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("event_id", eventId)
      .single()

    if (existingItem) {
      // Item already exists in cart
      return { success: false, error: "Item already exists in your cart", isNew: false }
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cartId,
        event_id: eventId,
        quantity: 1,
        price,
      })

      if (insertError) throw insertError
      return { success: true, isNew: true }
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, error: "Failed to add to cart" }
  }
}
