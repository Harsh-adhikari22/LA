"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface PackageFormData {
  title: string
  description: string
  price: number
  duration_hours: number
  max_capacity: number
  available_spots: number
  category: string
  location: string
  event_date: string
  image_url: string
  gallery_urls: string[]
  inclusions: string[]
  exclusions: string[]
  is_trending: boolean
  is_available: boolean
}

interface PackageFormProps {
  initialData?: Partial<PackageFormData>
  packageId?: string
  mode: "create" | "edit"
}

export function PackageForm({ initialData, packageId, mode }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    description: "",
    price: 0,
    duration_hours: 4,
    max_capacity: 10,
    available_spots: 10,
    category: "",
    location: "",
    event_date: "",
    image_url: "",
    gallery_urls: [],
    inclusions: [],
    exclusions: [],
    is_trending: false,
    is_available: true,
    ...initialData,
  })

  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")
  const [newGalleryUrl, setNewGalleryUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingMain, setIsUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState<string[]>([]) // store filenames being uploaded
  const [buckets, setBuckets] = useState<string[]>([])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])


  const router = useRouter()
  const supabase = createClient()

  const categories = [
    "Birthday",
    "Wedding",
    "Corporate",
    "Anniversary",
    "Graduation",
    "Baby Shower",
    "Engagement",
    "Housewarming",
    "Festival",
    "Custom Event",
  ]

  useEffect(() => {
    fetch("/api/admin/buckets")
      .then((res) => res.json())
      .then((data) => setBuckets(data.map((b: any) => b.name)))
      .catch(() => toast({ title: "Error", description: "Failed to load buckets", variant: "destructive" }))
  }, [])

  const handleInputChange = (field: keyof PackageFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData((prev) => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()],
      }))
      setNewInclusion("")
    }
  }

  const removeInclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }))
  }

  const addExclusion = () => {
    if (newExclusion.trim()) {
      setFormData((prev) => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclusion.trim()],
      }))
      setNewExclusion("")
    }
  }

  const removeExclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index),
    }))
  }

  const addGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        gallery_urls: [...prev.gallery_urls, newGalleryUrl.trim()],
      }))
      setNewGalleryUrl("")
    }
  }

  const removeGalleryUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_, i) => i !== index),
    }))
  }

async function handleFileUpload(file: File, bucket: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("bucket", bucket)
  console.log("file : ",file)
  console.log("bucket : ", bucket)
  console.log("Form Data: ", formData)
  for (const [key, value] of formData.entries()) {
    console.log("Form keys : ", key, value)
  } 
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) {
    console.log("Error occured in uploading.")
    throw new Error(data.error || "Failed to upload file")
  }

  return data.publicUrl
}

async function uploadMainImage() {
  if (!mainImageFile) return ""
  console.log("main Image : ",mainImageFile)
  return await handleFileUpload(mainImageFile, "Images")
}

async function uploadGalleryImages() {
  const urls: string[] = []
  console.log("gallery images",galleryFiles)
  for (const file of galleryFiles) {
    const url = await handleFileUpload(file, "Images")
    urls.push(url)
  }
  return urls
}

  // In your handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  try {
    console.log("Form data being submitted:", formData)
    console.log("Main image file:", mainImageFile)
    console.log("Gallery files:", galleryFiles)
    // 1️⃣ Upload main image
    const mainImageUrl = await uploadMainImage()

    // 2️⃣ Upload gallery images
    const galleryUrls = await uploadGalleryImages()

    // 3️⃣ Prepare payload for server API
    const payload = {
      ...formData,
      image_url: mainImageUrl || formData.image_url,
      gallery_urls: galleryUrls,
    }

    // 4️⃣ Send to server API
    const res = await fetch("/api/admin/packages", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to save package")

    toast({ title: "Success", description: "Package saved successfully!" })
    router.push("/admin/packages")
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" })
  } finally {
    setIsSubmitting(false)
  }
}



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Package Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Elegant Birthday Party Package"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your party package..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location/Venue *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Delhi, India"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Party Type</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select party type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Capacity */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Pricing & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="1299"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_hours}
                onChange={(e) => handleInputChange("duration_hours", Number.parseInt(e.target.value) || 4)}
                placeholder="4"
                min="1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_capacity">Max Capacity *</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => handleInputChange("max_capacity", Number.parseInt(e.target.value) || 1)}
                  placeholder="20"
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="available_spots">Available Spots *</Label>
                <Input
                  id="available_spots"
                  type="number"
                  value={formData.available_spots}
                  onChange={(e) => handleInputChange("available_spots", Number.parseInt(e.target.value) || 0)}
                  placeholder="15"
                  min="0"
                  max={formData.max_capacity}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Date */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Event Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_date">Event Date</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange("event_date", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="main_image">Main Image</Label>
              <Input
                id="main_image"
                type="file"
                accept="image/*"
                onChange={(e) => 
                  {
                    console.log("Selected File: ",e.target.files?.[0])
                    setMainImageFile(e.target.files?.[0] || null)
                  }
                }
              />

              {isUploadingMain ? (
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" /> Uploading main image...
                </div>
              ) : formData.image_url ? (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-2 w-40 h-28 object-cover rounded-lg border"
                />
              ) : null}
            </div>

            <div>
              <Label htmlFor="gallery_Images">Gallery Images</Label>
              <Input
                id="gallery_images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  console.log("Selected Files: ", files)
                  if (files) setGalleryFiles(Array.from(files))
                }}
              />

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.gallery_urls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-28 h-20 object-cover rounded-lg border"
                    />
                    <X
                      className="absolute top-1 right-1 w-4 h-4 cursor-pointer bg-white rounded-full"
                      onClick={() => removeGalleryUrl(index)}
                    />
                  </div>
                ))}

                {/* Show spinners for files still uploading */}
                {uploadingGallery.map((filename) => (
                  <div
                    key={filename}
                    className="w-28 h-20 flex items-center justify-center border rounded-lg text-gray-500"
                  >
                    <Loader2 className="w-5 h-5 animate-spin mr-1" />
                    <span className="text-xs">Uploading...</span>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Inclusions & Exclusions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Inclusions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="e.g., Decorations, catering"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInclusion())}
              />
              <Button type="button" onClick={addInclusion} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.inclusions.map((inclusion, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {inclusion}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeInclusion(index)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="py-6">
          <CardHeader>
            <CardTitle>Exclusions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                placeholder="e.g., Alcohol, transportation"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExclusion())}
              />
              <Button type="button" onClick={addExclusion} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.exclusions.map((exclusion, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {exclusion}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeExclusion(index)} />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Package Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_trending">Trending Package</Label>
              <p className="text-sm text-gray-600">Mark this package as trending to feature it prominently</p>
            </div>
            <Switch
              id="is_trending"
              checked={formData.is_trending}
              onCheckedChange={(checked) => handleInputChange("is_trending", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_available">Available for Booking</Label>
              <p className="text-sm text-gray-600">Toggle package availability for customers</p>
            </div>
            <Switch
              id="is_available"
              checked={formData.is_available}
              onCheckedChange={(checked) => handleInputChange("is_available", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === "create" ? "Create Package" : "Update Package"}
        </Button>
      </div>
    </form>
  )
}



