"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { addToWishlist, removeFromWishlist } from "@/lib/supabase/wishlists"
import { useToast } from "@/hooks/use-toast"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface WishlistButtonProps {
  eventId: string
  isInWishlist: boolean
  isAuthenticated: boolean
  onWishlistChange?: (isInWishlist: boolean) => void
}

export function WishlistButton({
  eventId,
  isInWishlist,
  isAuthenticated,
  onWishlistChange,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(isInWishlist)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setInWishlist(isInWishlist)
  }, [isInWishlist])

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      })
      const qs = searchParams?.toString()
      const redirectTo = `${pathname}${qs ? `?${qs}` : ""}`
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)
      return
    }

    setIsLoading(true)

    try {
      if (inWishlist) {
        const result = await removeFromWishlist(eventId)
        if (result.success) {
          setInWishlist(false)
          onWishlistChange?.(false)
          toast({
            title: "Removed",
            description: "Event removed from your wishlist",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to remove from wishlist",
            variant: "destructive",
          })
        }
      } else {
        const result = await addToWishlist(eventId)
        if (result.success) {
          setInWishlist(true)
          onWishlistChange?.(true)
          toast({
            title: "Added",
            description: "Event added to your wishlist",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add to wishlist",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className="group rounded-full border-[#b88a22]/60 bg-black/70 hover:bg-[#d4af37] transition-all duration-300"
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-5 h-5 transition-all ${
          inWishlist ? "fill-[#d4af37] text-[#d4af37] group-hover:text-black group-hover:fill-black" : "text-[#d4af37]/70 group-hover:text-black"
        }`}
      />
    </Button>
  )
}
