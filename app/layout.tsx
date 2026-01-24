import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "LitAffairs — Explore, Experience, Enjoy",
    template: "%s | LitAffairs",
  },
  description:
    "Discover travel packages, plan trips, and explore destinations with LitAffairs (formerly VPrimeTours).",
  generator: "LitAffairs v1",
  applicationName: "LitAffairs",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
 }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Centralized font loading */}
        <link rel="icon" href="/favicon.ico" />
       <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
       <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Montserrat:wght@300;400;600;700&family=Inter:wght@300;400;500;600&family=Dancing+Script:wght@400;700&family=Shadows+Into+Light&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}
        <SpeedInsights/>
        <Analytics/>
      </body>
    </html>
  )
}
