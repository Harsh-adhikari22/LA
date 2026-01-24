import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getOrderWithItems } from "@/lib/supabase/orders"
import { redirect } from "next/navigation"

interface OrderItem {
  id: string
  event_id: string
  event_title: string
  quantity: number
  unit_price: number
  total_price: number
}

interface Order {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string
  total_amount: number
  status: string
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  created_at: string
  order_items: OrderItem[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const supabase = await createClient()
  const { id } = await params

  // Verify user authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch order details
  let order: Order | null = null
  try {
    const orderData = await getOrderWithItems(id)
    
    // Verify order belongs to current user
    if (orderData.user_id !== user.id) {
      redirect("/")
    }
    
    order = orderData as Order
  } catch (error) {
    console.error("Error fetching order:", error)
    redirect("/")
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-xl text-gray-600">Order not found</p>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 mb-8 py-6">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-green-900 mb-2">Order Confirmed!</h1>
            <p className="text-green-700 text-lg">Thank you for your purchase</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Number & Status */}
            <Card className="py-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <span className="text-sm font-normal bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    {order.status.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Order Number</p>
                    <p className="text-xl font-bold text-gray-900">
                      {order.razorpay_order_id.substring(0, 12).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Order Date</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center pb-3 border-b last:border-0"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{item.event_title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.total_price.toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Details */}
            <Card className="py-6">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold text-gray-900">{order.full_name}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-600">{order.city}, {order.zip_code}</p>
                <p className="text-gray-600">Phone: {order.phone}</p>
                <p className="text-gray-600">Email: {order.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 py-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{order.total_amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{order.total_amount.toLocaleString("en-IN")}</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Payment Confirmed</p>
                  <p>
                    Payment ID:{" "}
                    <span className="font-mono">{order.razorpay_payment_id}</span>
                  </p>
                </div>


                <div className="space-y-2 pt-4">
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  >
                    <Link href="/">
                      <Home className="w-4 h-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mt-6 py-6">
              <CardHeader>
                <CardTitle className="text-base">What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-gray-700">Order confirmed and payment received</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p className="text-gray-700">You'll receive a confirmation email shortly</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p className="text-gray-700">We'll send you tracking updates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </main>
  )
}
