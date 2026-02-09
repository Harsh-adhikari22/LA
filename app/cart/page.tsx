"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getCart, removeFromCart, updateCartItemQuantity } from "@/lib/supabase/cart"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface CartItem {
  id: string
  event_id: string
  quantity: number
  price: number
  events: {
    id: string
    title: string
    image_url: string
    discounted_price: number
  }
}

interface Cart {
  id: string
  user_id: string
  cart_items: CartItem[]
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/login")
          return
        }

        const cartData = await getCart(user.id)
        setCart(cartData as Cart)
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [supabase, router, toast])

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(cartItemId))
      await removeFromCart(cartItemId)
      setCart((prev) =>
        prev
          ? {
              ...prev,
              cart_items: prev.cart_items.filter((item) => item.id !== cartItemId),
            }
          : null,
      )
      toast({
        title: "Removed",
        description: "Item removed from cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    }
  }

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(cartItemId)
      return
    }

    try {
      setUpdatingItems((prev) => new Set(prev).add(cartItemId))
      await updateCartItemQuantity(cartItemId, newQuantity)
      setCart((prev) =>
        prev
          ? {
              ...prev,
              cart_items: prev.cart_items.map((item) =>
                item.id === cartItemId ? { ...item, quantity: newQuantity } : item,
              ),
            }
          : null,
      )
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      })
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(cartItemId)
        return newSet
      })
    }
  }

  const calculateTotal = () => {
    if (!cart) return 0
    return cart.cart_items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
          </div>
        </div>
      </main>
    )
  }

  const isEmpty = !cart || cart.cart_items.length === 0

  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/cart_bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-8 flex items-center gap-2 drop-shadow-[0_0_18px_rgba(212,175,55,0.7)] lit-affairs-font">
          <ShoppingCart className="w-8 h-8 text-[#d4af37]" />
          Shopping Cart
        </h1>

        {isEmpty ? (
          <Card className="border-[#b88a22]/40 bg-white/5 backdrop-blur-xl py-6 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="w-16 h-16 text-[#d4af37]/60 mb-4" />
              <p className="text-2xl text-[#f2d47a] mb-4 lit-affairs-font">Your cart is empty</p>
              <Button
                onClick={() => router.push("/events")}
                className="mt-4 bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-black/80"
              >
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Grid */}
            <div className="lg:col-span-2">
              <Card className="py-6 border-[#b88a22]/40 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                <CardHeader>
                  <CardTitle className="text-[#f2d47a] lit-affairs-font text-2xl">
                    {cart.cart_items.length} items in cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.cart_items.map((item) => (
                      <div key={item.id}>
                        <div className="flex gap-4 items-start">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-[#b88a22]/40">
                            {item.events.image_url && (
                              <Image
                                src={item.events.image_url}
                                alt={item.events.title}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-[#f2d47a] mb-2 truncate">
                              {item.events.title}
                            </h3>
                            <p className="text-[#d4af37]/80 text-sm mb-3">
                              Price: ₹{item.price.toLocaleString()}
                            </p>

                            {/* Quantity Control */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={updatingItems.has(item.id)}
                                className="p-1 hover:bg-[#d4af37] hover:text-black rounded-lg disabled:opacity-50 text-[#d4af37]"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-semibold text-[#f2d47a]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={updatingItems.has(item.id)}
                                className="p-1 hover:bg-[#d4af37] hover:text-black rounded-lg disabled:opacity-50 text-[#d4af37]"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Subtotal & Delete */}
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg text-[#f2d47a] mb-3">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={updatingItems.has(item.id)}
                              className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg disabled:opacity-50 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <Separator className="mt-4 bg-white/10" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 py-6 border-[#b88a22]/40 bg-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                <CardHeader>
                  <CardTitle className="text-[#f2d47a] lit-affairs-font text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#d4af37]/80">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#d4af37]/80">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-lg font-bold text-[#f2d47a]">
                    <span>Total</span>
                    <span className="text-[#d4af37]">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    onClick={() => router.push("/events")}
                    variant="outline"
                    className="w-full border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <WhatsAppButton />
    </main>
  )
}
