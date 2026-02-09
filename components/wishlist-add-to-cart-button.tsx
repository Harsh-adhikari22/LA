"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2, CheckCircle } from "lucide-react"
import { addToCartAction } from "@/lib/supabase/cart-actions"
import { useToast } from "@/hooks/use-toast"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface WishlistAddToCartButtonProps {
  eventId: string
  price: number
}

export function WishlistAddToCartButton({ eventId, price }: WishlistAddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const result = await addToCartAction(eventId, price)

      if (result.success) {
        setIsAdded(true)
        toast({
          title: "Added to cart",
          description: "Event has been added to your cart successfully",
        })
        // Reset button after 2 seconds
        setTimeout(() => setIsAdded(false), 2000)
      } else {
        if (result.authRequired) {
          toast({
            title: "Sign in required",
            description: "Please sign in to add items to your cart",
            variant: "destructive",
          })
          const qs = searchParams?.toString()
          const redirectTo = `${pathname}${qs ? `?${qs}` : ""}`
          router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)
          return
        }
        toast({
          title: "Info",
          description: result.error || "Failed to add item to cart",
          variant: result.isNew === false ? "default" : "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading || isAdded}
      className={`w-full transition-all duration-300 ${
        isAdded
          ? "bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)]"
          : "bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
