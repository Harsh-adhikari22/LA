import { supabase } from "./client"

interface EventFormData {
  title: string
  description: string
  actual_price: number
  discounted_price: number
  ratings: number
  reviews_count: number
  category: string
  image_url: string
  trending: boolean
  additional_images: string[]
}

interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  duration: string
  availability: string
  trending: boolean
}

interface ReviewFormData {
  event_id: string
  user_id: string
  stars: number
  review: string
  created_at: string
}

interface CategoryFormData {
  title: string
  description: string
  image_url: string
}

export async function getAllEvents(): Promise<EventFormData[]> {

  const { data, error } = await supabase.from("travel_packages").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching packages:", error)
    return []
  }

  return data || []
}

export async function getFeaturedEvents(): Promise<EventFormData[]> {

  const { data, error } = await supabase
    .from("travel_packages")
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

export async function getTrendingEvents(): Promise<EventFormData[]> {

  const { data, error } = await supabase
    .from("travel_packages")
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

export async function getEventById(id: string): Promise<EventFormData | null> {

  const { data, error } = await supabase.from("travel_packages").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching package:", error)
    return null
  }

  return data
}

export async function searchEvents(filters: FilterState): Promise<EventFormData[]> {

  let query = supabase.from("travel_packages").select("*")

  // Apply filters in sequence
  if (filters.category) {
    query = query.eq("category", filters.category)
  }

  if (filters.search) {
    query = query.ilike("destination", `%${filters.search}%`)
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

export async function getEventsByCategory(category: string): Promise<EventFormData[]> {

  const { data, error } = await supabase
    .from("travel_packages")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching packages by category:", error)
    return []
  }

  return data || []
}

export async function getAvailablePackages(): Promise<EventFormData[]> {
  const { data, error } = await supabase
    .from("travel_packages")
    .select("*")
    .eq("availability_status", "available")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching available packages:", error)
    return []
  }

  return data || []
}
