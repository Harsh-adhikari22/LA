import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { User, Package, BookOpen } from "lucide-react"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {profile?.full_name || data.user.email?.split("@")[0]}!
          </h1>
          <p className="text-gray-600">Manage your travel bookings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Email: {data.user.email}</p>
                <p className="text-sm text-gray-600">Name: {profile?.full_name || "Not set"}</p>
                <p className="text-sm text-gray-600">Phone: {profile?.phone || "Not set"}</p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Browse Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Browse Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Discover amazing travel destinations and book your next adventure
              </p>
              <Button asChild className="w-full">
                <Link href="/packages">View All Packages</Link>
              </Button>
            </CardContent>
          </Card>

          {/* My Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">View and manage your travel bookings</p>
              <Button variant="outline" className="w-full bg-transparent">
                View Bookings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Access */}
        {profile?.is_admin && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-primary">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                You have admin privileges. Access the admin dashboard to manage packages and bookings.
              </p>
              <Button asChild>
                <Link href="/admin">Go to Admin Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
