import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
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

    // Get user's orders with items
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        razorpay_order_id,
        total_amount,
        status,
        delivery_status,
        full_name,
        email,
        phone,
        address,
        city,
        zip_code,
        created_at,
        updated_at,
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
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error("Error in GET /api/orders:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
