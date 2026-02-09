"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { OrderCard } from "@/components/order-card"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"

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
  razorpay_order_id: string
  total_amount: number
  status: string
  delivery_status: string
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  zip_code: string
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

export default function YourOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/orders")

        if (response.status === 401) {
          router.push("/auth/login")
          return
        }

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <Navbar />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/contact_bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <main className="flex-1 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.8)]">
              Your Orders
            </h1>
            <p className="text-[#f2d47a] mt-2 lit-affairs-font text-[clamp(1.2rem,2.6vw,1.8rem)] drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]">
              Track and manage all your orders in one place
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="w-8 h-8 text-[#d4af37] animate-spin" />
              <p className="mt-4 text-[#f2d47a] lit-affairs-font">Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-black/70 border border-red-700/50 rounded-lg p-6 text-center">
              <p className="text-red-300 font-medium">{error}</p>
              <p className="text-red-200 text-sm mt-1">Please try refreshing the page</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="bg-white/5 rounded-2xl border border-[#b88a22]/40 backdrop-blur-xl p-12 text-center shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              <div className="mb-4">
                <svg
                  className="mx-auto w-16 h-16 text-[#d4af37]/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#f2d47a] mb-2 lit-affairs-font">No orders yet</h2>
              <p className="text-[#e6c768] mb-6 lit-affairs-font">You haven't placed any orders yet. Start shopping now!</p>
              <Button
                onClick={() => router.push("/packages")}
                className="bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
              >
                Browse Packages
              </Button>
            </div>
          )}

          {/* Orders List */}
          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <WhatsAppButton />
    </div>
  )
}
