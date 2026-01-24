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
  const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching events:", error)
    return []
  }
  return data || []
}

export async function getFeaturedEvents(): Promise<EventFormData[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("trending", true)
    .order("created_at", { ascending: false })
    .limit(6)
  if (error) {
    console.error("Error fetching featured events:", error)
    return []
  }
  return data || []
}

export async function getTrendingEvents(): Promise<EventFormData[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("trending", true)
    .order("created_at", { ascending: false })
    .limit(6)
  if (error) {
    console.error("Error fetching trending events:", error)
    return []
  }
  return data || []
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      categories ( id, title )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function searchEvents(filters: FilterState): Promise<EventFormData[]> {
  let query = supabase.from("events").select("*")
  if (filters.category) query = query.eq("category", filters.category)
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }
  if (filters.priceRange !== undefined) {
    query = query.gte("discounted_price", filters.priceRange[0]).lte("discounted_price", filters.priceRange[1])
  }
  if (filters.trending) query = query.eq("trending", true)
  const { data, error } = await query.order("created_at", { ascending: false })
  if (error) {
    console.error("Error searching events:", error)
    return []
  }
  return data || []
}

export async function getEventsByCategory(category: string): Promise<EventFormData[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching events by category:", error)
    return []
  }
  return data || []
}

export async function getAvailablePackages(): Promise<EventFormData[]> {
  const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching events:", error)
    return []
  }
  return data || []
}
