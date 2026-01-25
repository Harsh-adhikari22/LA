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
import { log } from "console"

interface PackageFormData {
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

interface PackageFormProps {
  initialData?: Partial<PackageFormData>
  packageId?: string
  mode: "create" | "edit"
}

export function PackageForm({ initialData, packageId, mode }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    title: "",
    description: "",
    actual_price: 0,
    discounted_price: 0,
    category: "",
    image_url: "",
    additional_images: [],
    trending: false,
    id: "",
    created_at: "",
    rating: 0,
    reviews_count: 0,
    ...initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingMain, setIsUploadingMain] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState<string[]>([]) // store filenames being uploaded
  const [buckets, setBuckets] = useState<string[]>([])
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([])

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
  const loadCategories = async () => {
    console.log("Loading categories...")

    const { data, error } = await supabase
      .from("categories")
      .select("id,title")

    if (error) {
      console.error("Category fetch error:", error)

      toast({
        title: "Category Error",
        description: error.message,
        variant: "destructive",
      })

      return
    }

    console.log("Fetched categories:", data)
    setCategories(data ?? [])
  }

  loadCategories()
}, [])


  useEffect(() => {
    fetch("/api/admin/buckets")
      .then((res) => res.json())
      .then((data) => setBuckets(data.map((b: any) => b.name)))
      .catch(() => toast({ title: "Error", description: "Failed to load buckets", variant: "destructive" }))
  }, [])

  const handleInputChange = (field: keyof PackageFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  const removeGalleryUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_urls: prev.additional_images.filter((_, i) => i !== index),
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
  return await handleFileUpload(mainImageFile, "Categories")
}

async function uploadGalleryImages() {
  const urls: string[] = []
  console.log("gallery images",galleryFiles)
  for (const file of galleryFiles) {
    const url = await handleFileUpload(file, "Categories")
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
      additional_images: galleryUrls.length
      ? galleryUrls
      : formData.additional_images,
      ...(packageId && { id: packageId }),
    }

    // 4️⃣ Send to server API
    const res = await fetch("/api/admin/packages", {
      method: mode === "create" ? "POST" : "PUT",
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to save event")

    toast({ title: "Success", description: `Event ${mode === "create" ? "created" : "updated"} successfully!` })
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
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Elegant Birthday Party"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your event..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="category">Event Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
            <Label htmlFor="actual_price">Actual Price (₹)</Label>
              <Input
                id="actual_price"
                type="number"
                value={formData.actual_price}
                onChange={(e) =>
                  handleInputChange("actual_price", Number.parseFloat(e.target.value) || 0)
                }
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="discounted_price">Discounted / Updated Price (₹)</Label>
              <Input
                id="discounted_price"
                type="number"
                value={formData.discounted_price}
                onChange={(e) =>
                  handleInputChange("discounted_price", Number.parseFloat(e.target.value) || 0)
                }
                min="0"
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
                {Array.isArray(formData.additional_images) &&
                  formData.additional_images.map((url, index) => (
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

      
      {/* Settings */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Event Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_trending">Trending Event</Label>
              <p className="text-sm text-gray-600">Mark this event as trending to feature it prominently</p>
            </div>
            <Switch
              id="is_trending"
              checked={formData.trending}
              onCheckedChange={(checked) => handleInputChange("trending", checked)}
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
          {mode === "create" ? "Create Event" : "Update Event"}
        </Button>
      </div>
    </form>
  )
}



