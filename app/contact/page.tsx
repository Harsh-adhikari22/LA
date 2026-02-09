import { Navbar } from "@/components/navbar"
import { ContactSection } from "@/components/contact-section"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black relative">
      <Navbar />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/contact_bg.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative">
        <ContactSection />
      </div>
      <WhatsAppButton />
    </main>
  )
}
