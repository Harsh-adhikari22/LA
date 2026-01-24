import { createClient } from "./server"

export interface OrderData {
  user_id: string
  razorpay_order_id: string
  total_amount: number
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  cart_items: Array<{
    event_id: string
    event_title: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export interface PaymentVerificationData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function createOrder(orderData: OrderData) {
  const supabase = await createClient()

  try {
    // Start a transaction-like operation
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.user_id,
        razorpay_order_id: orderData.razorpay_order_id,
        total_amount: orderData.total_amount,
        full_name: orderData.full_name,
        email: orderData.email,
        phone: orderData.phone,
        address: orderData.address,
        city: orderData.city,
        zip_code: orderData.zip_code,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = orderData.cart_items.map((item) => ({
      order_id: order.id,
      event_id: item.event_id,
      event_title: item.event_title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    return { success: true, orderId: order.id, order }
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function verifyAndUpdateOrder(
  verificationData: PaymentVerificationData,
  orderId: string
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from("orders")
      .update({
        razorpay_payment_id: verificationData.razorpay_payment_id,
        razorpay_signature: verificationData.razorpay_signature,
        status: "success",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

export async function getOrderWithItems(orderId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          event_id,
          event_title,
          quantity,
          unit_price,
          total_price
        )
      `
      )
      .eq("id", orderId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          event_id,
          event_title,
          quantity,
          unit_price,
          total_price
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw error
  }
}
