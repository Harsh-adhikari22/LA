import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <main className="p-6 overflow-auto h-full">{children}</main>
      </div>
    </div>
  )
}
