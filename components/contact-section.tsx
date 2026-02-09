"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react"
import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const adminPhoneNumber = "+918700185869";
  const adminEmail = "LitAffairs1@gmail.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - could integrate with email service
    console.log("Contact form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const handleWhatsAppContact = () => {
    const message = `Hi! I'd like to get in touch regarding your party planning services. 

    Name: ${formData.name}
    Email: ${formData.email}
    Phone: ${formData.phone}
    Subject: ${formData.subject}
    Message: ${formData.message}`

    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }
  

  const handleEmail = async () => {
    try {
      // defensive checks
      if (!formData || !adminEmail) {
        console.error("Missing payload: formData or adminEmail is undefined");
        return;
      }
  
      const payload = {
        adminEmail: String(adminEmail),
        // ensure formData is a plain object (not a FormData instance)
        formData: {
          name: formData.name ?? "",
          email: formData.email ?? "",
          phone: formData.phone ?? "",
          subject: formData.subject ?? "",
          message: formData.message ?? "",
        },
      };
  
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      // Defensive parsing: only call .json() if content-type is application/json
      const contentType = response.headers.get("content-type") || "";
      let data: any = null;
  
      if (contentType.includes("application/json")) {
        // try parse JSON; this can still throw if body is truncated, so wrap in try
        try {
          data = await response.json();
        } catch (parseErr) {
          console.error("Failed to parse JSON response:", parseErr);
          const raw = await response.text();
          data = { __parseError: String(parseErr), raw };
        }
      } else {
        // fallback: read text and attempt to JSON.parse, otherwise keep as raw text
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
      }
  
      // If server returned a non-2xx, show details for debugging
      if (!response.ok) {
        console.error("send-email responded with error:", {
          status: response.status,
          statusText: response.statusText,
          body: data,
        });
        return;
      }
  
      // success path — some servers use `success`, some `ok`, so check both
      if (data && (data.success === true || data.ok === true)) {
        console.log("Email sent successfully", data);
      } else {
        console.warn("Email request completed but server returned unexpected payload:", data);
      }
    } catch (err) {
      // This will catch network errors and runtime errors (including invalid URL construction)
      console.error("Request failed:", err);
    }
  };

  return (
    <section className="py-16 bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-[clamp(3rem,6vw,4.5rem)] font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_26px_rgba(212,175,55,0.9)]">
            Get in Touch
          </h2>
          <p className="text-[clamp(1.3rem,2.8vw,2rem)] text-[#f2d47a] max-w-3xl mx-auto lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.7)]">
            Have questions about our party packages? We're here to help you plan your perfect celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-3xl font-bold text-[#f2d47a] mb-6 lit-affairs-font">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black/60 border border-[#b88a22]/50 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.35)]">
                    <Phone className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#f2d47a]">Phone</p>
                    <p className="text-[#e6c768]">{adminPhoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black/60 border border-[#b88a22]/50 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.35)]">
                    <Mail className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#f2d47a]">Email</p>
                    <p className="text-[#e6c768]">{adminEmail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black/60 border border-[#b88a22]/50 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.35)]">
                    <Clock className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#f2d47a]">Business Hours</p>
                    <p className="text-[#e6c768]">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-[#e6c768]">Sat - Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Contact */}
            <Card className="bg-white/5 border-[#b88a22]/40 backdrop-blur-xl py-6 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#f2d47a] lit-affairs-font">
                  <MessageCircle className="w-5 h-5 mr-2 text-[#d4af37]" />
                  Quick WhatsApp Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#e6c768] mb-4 lit-affairs-font">
                  Get instant responses to your party planning queries through WhatsApp. We're online and ready to help!
                </p>
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                  disabled={!formData.name || !formData.message}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="animate-slide-up py-8 backdrop-blur-xl bg-white/5 text-white border border-[#b88a22]/40 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-[#f2d47a] lit-affairs-font">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="py-2 text-[#f2d47a] lit-affairs-font">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="border border-[#b88a22]/40 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="py-2 text-[#f2d47a] lit-affairs-font">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="border border-[#b88a22]/40 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="py-2 text-[#f2d47a] lit-affairs-font">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (234) 567-8900"
                      className="border border-[#b88a22]/40 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="py-2 text-[#f2d47a] lit-affairs-font">Subject *</Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Party planning inquiry"
                      className="border border-[#b88a22]/40 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="py-2 text-[#f2d47a] lit-affairs-font">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your party plans or questions..."
                    className="border border-[#b88a22]/40 bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    onClick={handleEmail}
                    className="flex-1 bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                  >
                    <Send className="size-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleWhatsAppContact}
                    className="flex-1 bg-black/60 text-[#d4af37] border border-[#b88a22]/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
