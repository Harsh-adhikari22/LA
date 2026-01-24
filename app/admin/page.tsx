import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Package, Users, BookOpen, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch dashboard stats
  const [packagesResult, bookingsResult, usersResult] = await Promise.all([
    supabase.from("party_packages").select("id, is_available, is_trending"),
    supabase.from("bookings").select("id, booking_status, total_amount"),
    supabase.from("profiles").select("id"),
  ])

  const totalPackages = packagesResult.data?.length || 0
  const availablePackages = packagesResult.data?.filter((p) => p.is_available).length || 0
  const trendingPackages = packagesResult.data?.filter((p) => p.is_trending).length || 0

  const totalBookings = bookingsResult.data?.length || 0
  const confirmedBookings = bookingsResult.data?.filter((b) => b.booking_status === "confirmed").length || 0
  const totalRevenue = bookingsResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0

  const totalUsers = usersResult.data?.length || 0

  const stats = [
    {
      title: "Total Packages",
      value: totalPackages,
      description: `${availablePackages} available`,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      description: `${confirmedBookings} confirmed`,
      icon: BookOpen,
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
      value: `$${totalRevenue.toLocaleString()}`,
      description: "Total earnings",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to LitAffairs admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="py-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/admin/packages/new"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Add Package</p>
              </a>
              <a
                href="/admin/bookings"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">View Bookings</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">New booking received</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">Package updated</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-gray-600">New user registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
