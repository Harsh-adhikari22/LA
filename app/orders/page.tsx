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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage all your orders in one place</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto w-16 h-16 text-gray-400"
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping now!</p>
              <Button
                onClick={() => router.push("/packages")}
                className="bg-indigo-600 hover:bg-indigo-700"
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
