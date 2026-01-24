import { createClient } from "./client"

export async function addToCart(userId: string, eventId: string, price: number, quantity: number = 1) {
  const supabase = createClient()

  try {
    // First, check if user has a cart, if not create one
    const { data: cartData, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single()

    let cartId: string

    if (!cartData) {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
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
      // Update quantity
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)

      if (updateError) throw updateError
    } else {
      // Insert new cart item
      const { error: insertError } = await supabase.from("cart_items").insert({
        cart_id: cartId,
        event_id: eventId,
        quantity,
        price,
      })

      if (insertError) throw insertError
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export async function getCart(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("carts")
      .select(
        `
        id,
        user_id,
        created_at,
        updated_at,
        cart_items (
          id,
          event_id,
          quantity,
          price,
          created_at,
          events (
            id,
            title,
            image_url,
            discounted_price
          )
        )
      `
      )
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data || null
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("cart_items").delete().eq("id", cartItemId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error removing from cart:", error)
    throw error
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const supabase = createClient()

  try {
    if (quantity <= 0) {
      return removeFromCart(cartItemId)
    }

    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error updating cart item quantity:", error)
    throw error
  }
}
