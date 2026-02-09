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
    <div className="flex h-screen bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_55%)]" />
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 relative">
        <main className="p-6 overflow-auto h-full">
          <div className="rounded-2xl border border-[#b88a22]/30 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.2)] p-6 transition-all duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
