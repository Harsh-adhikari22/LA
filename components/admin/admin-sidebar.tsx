"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Users, BookOpen, Settings, Menu, X, LogOut, Plus } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Party Packages", href: "/admin/packages", icon: Package },
  { name: "Bookings", href: "/admin/bookings", icon: BookOpen },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: Settings },
]

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-black/80 border-[#b88a22]/60 text-[#d4af37] shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-black/90 border-r border-[#b88a22]/40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 backdrop-blur-xl",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-[#b88a22]/40">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-[#b88a22]/60 shadow-[0_0_14px_rgba(212,175,55,0.45)]">
              <span className="text-[#d4af37] font-bold text-lg">LA</span>
            </div>
            <span className="ml-2 text-4xl font-bold text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.8)] lit-affairs-font">LitAffairs</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-[#d4af37] text-black shadow-[0_0_16px_rgba(212,175,55,0.7)]"
                      : "text-[#f2d47a] hover:bg-[#d4af37] hover:text-black",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3 text-current" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-t border-[#b88a22]/40">
            <Button
              asChild
              className="w-full mb-3 bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
            >
              <Link href="/admin/packages/new">
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start text-[#f2d47a] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2 text-[#d4af37]" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
