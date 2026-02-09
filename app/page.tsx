import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturedPackages } from "@/components/featured-packages"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { IntroVideoOverlay } from "@/components/intro-video-overlay"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <IntroVideoOverlay />
      <Navbar />
      <HeroSection />
      <FeaturedPackages />
      <WhatsAppButton />
    </main>
  )
}
