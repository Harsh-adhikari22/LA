"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { exportToExcel } from "@/lib/export-to-excel"

interface PartyPackage {
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
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PartyPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPackages(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const { error } = await supabase.from("events").delete().eq("id", packageId)

      if (error) throw error

      setPackages(packages.filter((p) => p.id !== packageId))
      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-[#d4af37]">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.8)]">Events</h1>
          <p className="text-[#f2d47a]">Manage your party events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
            onClick={() =>
              exportToExcel({
                data: filteredPackages.map((pkg) => ({
                  id: pkg.id,
                  title: pkg.title,
                  description: pkg.description,
                  category: pkg.category,
                  discounted_price: pkg.discounted_price,
                  actual_price: pkg.actual_price,
                  rating: pkg.rating,
                  reviews_count: pkg.reviews_count,
                  trending: pkg.trending ? "Yes" : "No",
                  created_at: pkg.created_at ? new Date(pkg.created_at).toLocaleString() : "",
                })),
                fileName: "party-packages",
                sheetName: "Party Packages",
              })
            }
          >
            Export to Excel
          </Button>
          <Button asChild className="bg-black text-[#d4af37] border border-[#b88a22]/60 shadow-[0_0_18px_rgba(212,175,55,0.35)] hover:bg-[#d4af37] hover:text-black transition-all duration-300">
            <Link href="/admin/packages/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>

      <Card className="py-6 bg-white/5 border border-[#b88a22]/40 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)] transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d4af37] w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/60 border-[#b88a22]/40 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus-visible:ring-[#d4af37]/40"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#b88a22]/30">
                <TableHead className="text-[#f2d47a]">Event</TableHead>
                <TableHead className="text-[#f2d47a]">Price</TableHead>
                <TableHead className="text-[#f2d47a]">Rating</TableHead>
                <TableHead className="text-[#f2d47a]">Reviews</TableHead>
                <TableHead className="text-[#f2d47a]">Status</TableHead>
                <TableHead className="text-[#f2d47a]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id} className="border-[#b88a22]/20">
                  <TableCell>
                    <div>
                      <div className="font-medium text-[#f2d47a]">{pkg.title}</div>
                      <div className="flex gap-1 mt-1">
                        {pkg.category && (
                          <Badge variant="secondary" className="text-xs bg-black/60 text-[#d4af37] border border-[#b88a22]/40">
                            {pkg.category}
                          </Badge>
                        )}
                        {pkg.trending && <Badge className="text-xs bg-[#d4af37] text-black">Trending</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#f2d47a]">₹{Number(pkg.discounted_price).toLocaleString()}</TableCell>
                  <TableCell className="text-[#f2d47a]">{pkg.rating?.toFixed(1) || "—"}</TableCell>
                  <TableCell className="text-[#f2d47a]">{pkg.reviews_count || 0}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#d4af37]/20 text-[#f2d47a] border border-[#b88a22]/40">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/90 border border-[#b88a22]/50 text-[#f2d47a] shadow-[0_0_24px_rgba(212,175,55,0.35)]">
                        <DropdownMenuItem asChild>
                          <Link href={`/events/${pkg.id}`} className="flex items-center gap-2 text-[#f2d47a] hover:text-black">
                            <Eye className="w-4 h-4 mr-2 text-[#d4af37]" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/packages/${pkg.id}/edit`} className="flex items-center gap-2 text-[#f2d47a] hover:text-black">
                            <Edit className="w-4 h-4 mr-2 text-[#d4af37]" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-[#f2d47a] hover:text-black">
                          <Trash2 className="w-4 h-4 mr-2 text-[#d4af37]" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
