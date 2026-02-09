import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Sparkles, Users, ShoppingCart, TrendingUp, Star } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [eventsResult, ordersResult, usersResult, reviewsResult] = await Promise.all([
    supabase.from("events").select("id, trending, rating, reviews_count"),
    supabase.from("orders").select("id, status, total_amount"),
    supabase.from("profiles").select("id"),
    supabase.from("reviews").select("id, stars"),
  ])

  const totalEvents = eventsResult.data?.length || 0
  const trendingEvents = eventsResult.data?.filter((e) => e.trending).length || 0

  const totalOrders = ordersResult.data?.length || 0
  const pendingOrders = ordersResult.data?.filter((o) => o.status === "pending").length || 0
  const successOrders = ordersResult.data?.filter((o) => o.status === "success").length || 0
  const failedOrders = ordersResult.data?.filter((o) => o.status === "failed").length || 0
  const totalRevenue = ordersResult.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

  const totalUsers = usersResult.data?.length || 0
  const totalReviews = reviewsResult.data?.length || 0

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      description: `${trendingEvents} trending`,
      icon: Sparkles,
      color: "text-blue-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      description: `${pendingOrders} pending, ${successOrders} completed, ${failedOrders} failed`,
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "Total earnings",
      icon: TrendingUp,
      color: "text-orange-600",
    },
    {
      title: "Reviews",
      value: totalReviews,
      description: "Customer feedback",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[54px] font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_22px_rgba(212,175,55,0.9)]">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Welcome to LitAffairs admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="py-6 bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#f2d47a]">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-[#d4af37]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#d4af37]">{stat.value}</div>
              <p className="text-xs text-[#e6c768] mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="py-6 bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)]">
          <CardHeader>
            <CardTitle className="text-[#f2d47a]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/packages/new"
                className="group p-4 border border-[#b88a22]/40 rounded-lg bg-black/60 text-[#f2d47a] hover:bg-[#d4af37] hover:text-black transition-all duration-300 text-center"
              >
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#d4af37] group-hover:text-black transition-colors duration-300" />
                <p className="text-sm font-medium">Add Event</p>
              </a>
              <a
                href="/admin/bookings"
                className="group p-4 border border-[#b88a22]/40 rounded-lg bg-black/60 text-[#f2d47a] hover:bg-[#d4af37] hover:text-black transition-all duration-300 text-center"
              >
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-[#d4af37] group-hover:text-black transition-colors duration-300" />
                <p className="text-sm font-medium">View Orders</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
