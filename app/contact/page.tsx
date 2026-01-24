import { Navbar } from "@/components/navbar"
import { ContactSection } from "@/components/contact-section"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[url('/mountain.jpg')] bg-cover bg-fixed bg-center bg-no-repeat relative">
      <Navbar />
      <ContactSection />
      <WhatsAppButton />
    </main>
  )
}
