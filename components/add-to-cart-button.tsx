"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { addToCart } from "@/lib/supabase/cart"
import { useToast } from "@/hooks/use-toast"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface AddToCartButtonProps {
  eventId: string
  price: number
  userId?: string
}

export function AddToCartButton({ eventId, price, userId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleAddToCart = async () => {
    // Check if user is authenticated
    if (!userId) {
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

    setLoading(true)
    try {
      await addToCart(userId, eventId, price, 1)
      toast({
        title: "Added to cart",
        description: "Event has been added to your cart successfully",
      })
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
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Adding...
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
