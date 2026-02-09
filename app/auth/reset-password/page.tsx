"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const loadSession = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        setError(error.message)
      }
      setIsReady(!!data.session)
    }

    loadSession()
  }, [])

  const handleReset = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-2xl font-bold gradient-text">VPrimeTours</span>
          </Link>
        </div>

        <Card className="animate-fade-in py-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Set a new password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isReady && !isSuccess ? (
              <div className="text-sm text-muted-foreground text-center">
                This reset link is invalid or has expired.
              </div>
            ) : (
              <form onSubmit={handleReset}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isSuccess}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading || isSuccess}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {isSuccess && (
                    <p className="text-sm text-green-600">Password updated. You can now sign in.</p>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
                    {isLoading ? "Updating..." : "Update password"}
                  </Button>
                </div>
              </form>
            )}
            <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="underline underline-offset-4 text-primary hover:text-primary/80">
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
