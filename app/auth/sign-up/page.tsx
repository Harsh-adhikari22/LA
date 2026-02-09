"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push(
        redirectTo ? `/auth/sign-up-success?redirect=${encodeURIComponent(redirectTo)}` : "/auth/sign-up-success"
      )
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/Logo.JPG"
          alt="VPrimeTours logo background"
          fill
          className="object-contain opacity-20 blur-md"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/80 border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.45)]">
              <span className="font-bold text-xl text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.65)]">
                L
              </span>
            </div>
            <span className="text-2xl font-bold text-[#d4af37] drop-shadow-[0_0_14px_rgba(212,175,55,0.7)]">
              LitAffairs
            </span>
          </Link>
        </div>

        <Card className="animate-fade-in py-6 border-[#b88a22]/40 bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-[#d4af37]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-[#d4af37] drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-[#e6c768]/80">
              Join VPrimeTours and start your adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-[#e6c768]">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-black/40 border-[#b88a22]/50 text-[#f2d47a] placeholder:text-[#c9a949]/60 focus-visible:ring-[#d4af37]/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[#e6c768]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/40 border-[#b88a22]/50 text-[#f2d47a] placeholder:text-[#c9a949]/60 focus-visible:ring-[#d4af37]/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[#e6c768]">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 bg-black/40 border-[#b88a22]/50 text-[#f2d47a] placeholder:text-[#c9a949]/60 focus-visible:ring-[#d4af37]/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#d4af37]/70 hover:text-[#f2d47a]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password" className="text-[#e6c768]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="repeat-password"
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="pr-10 bg-black/40 border-[#b88a22]/50 text-[#f2d47a] placeholder:text-[#c9a949]/60 focus-visible:ring-[#d4af37]/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#d4af37]/70 hover:text-[#f2d47a]"
                      aria-label={showRepeatPassword ? "Hide confirm password" : "Show confirm password"}
                      title={showRepeatPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-black/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <span className="text-[#e6c768]/80">Already have an account? </span>
                <Link
                  href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : "/auth/login"}
                  className="underline underline-offset-4 text-[#d4af37] hover:text-[#f2d47a]"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
