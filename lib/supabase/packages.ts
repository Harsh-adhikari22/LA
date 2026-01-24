import { supabase } from "./client"

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

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  duration: string
  availability: string
  trending: boolean
}

export async function getAllPackages(): Promise<PackageFormData[]> {

  const { data, error } = await supabase.from("party_packages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching packages:", error)
    return []
  }

  return data || []
}

export async function getFeaturedPackages(): Promise<PackageFormData[]> {

  const { data, error } = await supabase
    .from("party_packages")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured packages:", error)
    return []
  }

  return data || []
}

export async function getTrendingPackages(): Promise<PackageFormData[]> {

  const { data, error } = await supabase
    .from("party_packages")
    .select("*")
    .eq("is_trending", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching trending packages:", error)
    return []
  }

  return data || []
}

export async function getPackageById(id: string): Promise<PackageFormData | null> {

  const { data, error } = await supabase.from("party_packages").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching package:", error)
    return null
  }

  return data
}

export async function searchPackages(filters: FilterState): Promise<PackageFormData[]> {

  let query = supabase.from("party_packages").select("*")

  // Apply filters in sequence
  if (filters.category) {
    query = query.eq("category", filters.category)
  }

  if (filters.search) {
    query = query.ilike("location", `%${filters.search}%`)
    query = query.ilike("title", `%${filters.search}%`)
    query = query.ilike("description", `%${filters.search}%`)
  }

  if (filters.priceRange !== undefined) {
    query = query.gte("price", filters.priceRange[0])
    query = query.lte("price", filters.priceRange[1])
  }

  if (filters.availability) {
    query = query.eq("availability_status", filters.availability)
  }

  if (filters.trending) {
    query = query.eq("is_trending", true)
  }

  if (filters.duration) {
    query = query.eq("is_featured", true)
  }

  // Execute query with ordering
  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching packages:", error)
    return []
  }

  return data || []
}

export async function getPackagesByCategory(category: string): Promise<PackageFormData[]> {

  const { data, error } = await supabase
    .from("party_packages")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching packages by category:", error)
    return []
  }

  return data || []
}

export async function getAvailablePackages(): Promise<PackageFormData[]> {
  const { data, error } = await supabase
    .from("party_packages")
    .select("*")
    .eq("availability_status", "available")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching available packages:", error)
    return []
  }

  return data || []
}
