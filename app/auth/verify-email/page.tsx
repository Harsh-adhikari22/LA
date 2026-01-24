"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const supabase = createClient()
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleResend = async () => {
    setIsLoading(true)
    setMessage(null)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      setMessage("No email associated with this account.")
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    })

    if (error) setMessage(error.message)
    else setMessage("Verification email sent again. Please check your inbox.")

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="max-w-md w-full py-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Check your email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p>
            We’ve sent a verification link to your email.
            Click the link to activate your account and continue.
          </p>

          <p className="text-sm text-muted-foreground">
            If you don’t see the email, check your spam or promotions folders.
          </p>

          <Button
            className="w-full"
            onClick={handleResend}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Resend verification email"}
          </Button>

          {message && <p className="text-sm text-green-600">{message}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
