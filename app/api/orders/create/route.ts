import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createClient } from "@/lib/supabase/server"
import { getCart } from "@/lib/supabase/cart"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

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

    // Get request body
    const { fullName, email, phone, address, city, zipCode } = await request.json()

    // Validate input
    if (!fullName || !email || !phone || !address || !city || !zipCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Calculate total amount (in paise for Razorpay)
    const totalAmount = cartData.cart_items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
    const amountInPaise = Math.round(totalAmount * 100)

    // Create Razorpay order
    // Receipt must be no more than 40 characters
    const timestamp = Date.now().toString().slice(-10)
    const receipt = `order_${timestamp}`.substring(0, 40)
    
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: user.id,
        fullName,
        email,
        phone,
        address,
        city,
        zipCode,
      },
    })

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: "INR",
      cartData: {
        items: cartData.cart_items,
        total: totalAmount,
      },
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
