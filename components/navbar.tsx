"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, LogOut, LogIn, MapIcon, Package, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const cartChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const cartIdRef = useRef<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Cart count badge (sum of quantities)
  useEffect(() => {
    const cleanupChannel = () => {
      if (cartChannelRef.current) {
        supabase.removeChannel(cartChannelRef.current)
        cartChannelRef.current = null
      }
      cartIdRef.current = null
    }

    const fetchAndSubscribe = async () => {
      cleanupChannel()
      if (!user?.id) {
        setCartCount(0)
        return
      }

      // Find user's cart id (if none, count is 0)
      const { data: cartData, error: cartError } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (cartError || !cartData?.id) {
        setCartCount(0)
        return
      }

      const cartId = cartData.id as string
      cartIdRef.current = cartId

      const fetchCount = async () => {
        const { data, error } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("cart_id", cartId)

        if (error || !data) {
          setCartCount(0)
          return
        }
        const total = data.reduce((sum: number, row: any) => sum + (Number(row.quantity) || 0), 0)
        setCartCount(total)
      }

      await fetchCount()

      // Subscribe to cart item changes for this cart
      cartChannelRef.current = supabase
        .channel(`cart-items-${cartId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cart_items", filter: `cart_id=eq.${cartId}` },
          () => {
            fetchCount()
          }
        )
        .subscribe()
    }

    fetchAndSubscribe()
    return () => cleanupChannel()
  }, [supabase, user?.id])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const pathName = usePathname()
  const isCategoriesActive = pathName === "/categories"
  const isCartActive = pathName === "/cart"
  const isContactActive = pathName === "/contact"

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md animate-fade-in border-b border-white/10">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div id="navbar-logo-slot" className="w-20 h-20 relative">
              <Image
                src="/MiniLogo.png"
                alt="LIT-AFFAIRS"
                fill
                className="object-contain"
              />
            </div>
            <span className="group inline-block overflow-visible">
  <span
    className="
      inline-block
      max-w-0
      opacity-0
      overflow-hidden
      whitespace-nowrap
      transition-all duration-300 ease-out
      group-hover:max-w-[18rem]
      group-hover:opacity-100
      mdma
      px-2
      text-[#d4af37]
      text-4xl
      drop-shadow-[0_0_14px_rgba(212,175,55,0.8)]
    "
  >
    LitAffairs
  </span>
</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-0 text-[#d4af37]">
            <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-0 pl-2">
              {/* <Search className="relative top-2 left-9 transform -translate-y-1/2 w-4 h-4" /> */}
              <div className="flex items-center space-x-2 search-group">
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-[#d4af37] search-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>

            {/* Search Input */}
            <Input
              type="text"
              placeholder="Planning something special?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-0
                opacity-0
                border-0
                pl-0
                transition-all
                duration-300
                search-input
                group-hover:w-64
                group-hover:opacity-100
                group-hover:pl-10
                text-[#d4af37]
                placeholder:text-[#d4af37]/70
                hover:placeholder-[#d4af37]
                focus:ring-[#d4af37]
                focus:border-[#d4af37]
                focus:placeholder-[#d4af37]
                rajdhani
              "
            />
          </div>

          </form>
            <Link
              href="/categories"
              className={`px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:font-bold flex items-center gap-2 rajdhani group
                ${isCategoriesActive ? "bg-[#d4af37] text-black font-bold" 
                  : "hover:bg-[#d4af37] hover:text-black hover:font-bold"}
                `}
            >
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`size-6 ${isCategoriesActive ? "text-black" : "text-[#d4af37] group-hover:text-black"}`}
              strokeWidth={2}
            >
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="17" cy="7" r="3" />
                <circle cx="7" cy="17" r="3" />
                <path d="M14 14h6v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5ZM4 4h6v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4Z" />
              </g>
            </svg>
      
              <span className={`max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isCategoriesActive ? "max-w-[100px] opacity-100 font-bold"
                  : "max-w-0 opacity-0"
                }`
              }>Categories</span>
            </Link>
            <Link
              href="/cart"
              className={`px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:font-bold flex items-center gap-2 rajdhani group
                ${isCartActive ? "bg-[#d4af37] text-black font-bold" : "hover:bg-[#d4af37] hover:text-black hover:font-bold"}
                `}
            >
            <span className="relative inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`lucide lucide-shopping-cart-icon lucide-shopping-cart ${isCartActive ? "text-black" : "text-[#d4af37] group-hover:text-black"}`}
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,0,0,0.7)]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
              <span className={`max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isCartActive ? "max-w-[100px] opacity-100 font-bold"
                  : "max-w-0 opacity-0"
                }`
              }>Cart</span>
            </Link>
            <Link
              href="/contact"
              className={`px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:font-bold flex items-center gap-2 rajdhani group
                ${isContactActive ? "bg-[#d4af37] text-black font-bold" : "hover:bg-[#d4af37] hover:text-black hover:font-bold"}
                `}
            >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`size-6 ${isContactActive ? "text-black" : "text-[#d4af37] group-hover:text-black"}`}
            >
              <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
            </svg>
              <span className={`max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isContactActive ? "max-w-[100px] opacity-100 font-bold"
                  : "max-w-0 opacity-0"
                }`
              }>Contact</span>
            </Link>
            <div className="hidden md:flex items-center space-x-0 text-white rajdhani">
            
            {user ? (
              <div className="md:flex flex text-[#d4af37] items-center space-x-2 rajdhani hover:font-bold">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-[40px] rounded-full hover:bg-[#d4af37] hover:text-black overflow-hidden transition-all duration-300 group">
                      <User className="size-6 text-[#d4af37] group-hover:text-black" />
                      <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap">{user.email?.split("@")[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 bg-black/90 border border-[#b88a22]/50 text-[#f2d47a] shadow-[0_0_24px_rgba(212,175,55,0.35)]"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="flex items-center gap-2 cursor-pointer text-[#f2d47a] hover:text-black">
                        <Package className="size-4 text-[#d4af37]" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="flex items-center gap-2 cursor-pointer text-[#f2d47a] hover:text-black">
                        <Heart className="size-4 text-[#d4af37]" />
                        My Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-[#f2d47a] hover:text-black focus:text-black"
                    >
                      <LogOut className="size-4 mr-2 text-[#d4af37]" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex text-white items-center space-x-2 rajdhani">
                <Button
                  size="sm"
                  asChild
                  className="h-[40px] rounded-full bg-transparent hover:bg-transparent hover:font-bold overflow-hidden transition-all duration-300 group"
                >
                  <Link href="/auth/sign-up">
                  <LogIn className="size-6 flex-shrink-0 text-[#d4af37]" />
                  <span className="max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 overflow-hidden whitespace-nowrap text-white text-[16px]">
                      LogIn / SignUp
                  </span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
          </div>

          {/* Search Bar */}

          {/* Auth Buttons */}
          

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search party types, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 focus:ring-primary focus:border-primary"
                />
              </div>
            </form>

            <div className="flex flex-col space-y-2">
              <Link href="/plans" className="text-gray-700 hover:text-primary py-2">
                Plans
              </Link>
              <Link href="/places" className="text-gray-700 hover:text-primary py-2">
                Places
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary py-2">
                Contact
              </Link>
            </div>

            <div className="flex flex-col space-y-2 pt-4 border-t">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">Welcome, {user.email?.split("@")[0]}</span>
                  <Link href="/orders" className="text-gray-700 hover:text-primary py-2 flex items-center gap-2">
                    <Package className="size-4" />
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="text-gray-700 hover:text-primary py-2 flex items-center gap-2">
                    <Heart className="size-4" />
                    My Wishlist
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
