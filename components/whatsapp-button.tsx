"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface WhatsAppButtonProps {
  packageTitle?: string
  packageId?: string
  customMessage?: string
}

export function WhatsAppButton({ packageTitle, packageId, customMessage }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const adminPhoneNumber = "+918700185869" // Replace with actual admin WhatsApp number

  const quickMessages = [
    "Hi! I'm interested in your party packages. Can you help me?",
    "I'd like to know more about your available decorations.",
    "Can you provide more details about pricing and availability?",
    "I have questions about booking and payment options.",
    "What are your current party deals and offers?",
  ]

  const handleWhatsAppClick = (messageText?: string) => {
    let finalMessage = messageText || message || quickMessages[0]

    if (packageTitle && packageId) {
      finalMessage = `Hi! I'm interested in the "${packageTitle}" party package (ID: ${packageId}). ${finalMessage}`
    }

    if (customMessage) {
      finalMessage = customMessage
    }

    const whatsappUrl = `https://wa.me/${adminPhoneNumber.replace("+", "")}?text=${encodeURIComponent(finalMessage)}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
    setMessage("")
  }

  const handleQuickMessage = (quickMessage: string) => {
    handleWhatsAppClick(quickMessage)
  }

  return (
    <>
      {/* WhatsApp Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] animate-scale-in rajdhani">
          <Card className="shadow-2xl border-0 bg-[url('/whatsappbg.jpg')] bg-cover bg-center bg-no-repeat relative">
            <CardHeader className="bg-green-800 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg pt-6 flex items-center">
                  <MessageCircle className="size-6" />
                  <span className="font-bold px-3">Chat with Lit-Affairs</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-md text-white pb-3">We typically reply within minutes</p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Package Context */}
              {packageTitle && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Asking about:</p>
                  <p className="text-sm text-blue-700">{packageTitle}</p>
                </div>
              )}

              {/* Quick Messages */}
              <div className="space-y-2">
                <p className="text-sm font-medium font-semibold text-gray-700">Quick messages:</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {quickMessages.slice(0, 5).map((quickMessage, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickMessage(quickMessage)}
                      className="w-full text-left p-2 text-sm bg-gray-200 hover:bg-gray-100 font-semibold rounded-lg transition-colors"
                    >
                      {quickMessage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Or write your own message:</p>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="resize-none font-semibold"
                />
                <Button onClick={() => handleWhatsAppClick()} className="w-full bg-green-800 hover:bg-green-500">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>

              {/* Contact Info */}
              <div className="text-center pt-2 border-t">
                <p className="text-xs text-gray-500 font-semibold">You'll be redirected to WhatsApp to continue the conversation</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg animate-pulse hover:animate-none transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="size-7 text-white" />
        </Button>

        {/* Online Status Badge */}
        <Badge className="absolute -top-1 -left-1 bg-green-400 text-green-900 text-xs px-2 py-1 animate-pulse rajdhani">
          Online
        </Badge>
      </div>
    </>
  )
}
