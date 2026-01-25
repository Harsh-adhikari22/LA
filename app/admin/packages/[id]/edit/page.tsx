"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PackageForm } from "@/components/admin/package-form"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  discounted_price: number
  actual_price: number
  rating: number
  reviews_count: number
  trending: boolean
  category: string
  image_url: string
  created_at: string
  additional_images: string[]
}

export default function EditPackagePage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const packageId = params.id as string

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", packageId)
          .single()

        if (error) throw error
        setEvent(data)
      } catch (err) {
        console.error("Error fetching event:", err)
        setError("Failed to load event")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [packageId, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="text-center h-64 flex items-center justify-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
          <p className="text-gray-600">{error || "Unable to load event details"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600">Update event details and information</p>
      </div>

      <PackageForm
        mode="edit"
        packageId={event.id}
        initialData={{
          title: event.title,
          description: event.description,
          actual_price: event.actual_price,
          discounted_price: event.discounted_price,
          category: event.category,
          image_url: event.image_url,
          trending: event.trending,
          additional_images: event.additional_images,
        }}
      />
    </div>
  )
}
