import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"
import { createOrder, verifyAndUpdateOrder, getOrderWithItems } from "@/lib/supabase/orders"
import { getCart, removeFromCart } from "@/lib/supabase/cart"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      fullName,
      email,
      phone,
      address,
      city,
      zipCode,
    } = await request.json()

    // Verify Razorpay signature
    const signaturePayload = `${razorpayOrderId}|${razorpayPaymentId}`
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(signaturePayload)
      .digest("hex")

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Get user's cart
    const cartData = await getCart(user.id)
    if (!cartData || cartData.cart_items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      )
    }

    // Calculate total
    const totalAmount = cartData.cart_items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    // Prepare order data
    const orderData = {
      user_id: user.id,
      razorpay_order_id: razorpayOrderId,
      total_amount: totalAmount,
      full_name: fullName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      zip_code: zipCode,
      cart_items: cartData.cart_items.map((item) => ({
        event_id: item.event_id,
        event_title: item.events.title,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      })),
    }

    // Create order in database
    const { orderId, order } = await createOrder(orderData)

    // Update order with payment details
    await verifyAndUpdateOrder(
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      },
      orderId
    )

    // Clear user's cart
    if (cartData.id) {
      for (const item of cartData.cart_items) {
        await removeFromCart(item.id)
      }
    }

    // Get full order details for email
    const fullOrder = await getOrderWithItems(orderId)

    return NextResponse.json({
      success: true,
      orderId,
      message: "Payment verified and order created successfully",
      order: fullOrder,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    )
  }
}
