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

interface PartyPackage {
  id: string
  title: string
  location: string
  price: number
  duration_hours: number
  category: string
  is_available: boolean
  is_trending: boolean
  available_spots: number
  max_capacity: number
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
        .from("party_packages")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPackages(data || [])
    } catch (error) {
      console.error("Error fetching packages:", error)
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return

    try {
      const { error } = await supabase.from("party_packages").delete().eq("id", packageId)

      if (error) throw error

      setPackages(packages.filter((p) => p.id !== packageId))
      toast({
        title: "Success",
        description: "Package deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting package:", error)
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      })
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Party Packages</h1>
          <p className="text-gray-600">Manage your party planning packages</p>
        </div>
        <Button asChild>
          <Link href="/admin/packages/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Package
          </Link>
        </Button>
      </div>

      <Card className="py-6">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pkg.title}</div>
                      <div className="flex gap-1 mt-1">
                        {pkg.category && (
                          <Badge variant="secondary" className="text-xs">
                            {pkg.category}
                          </Badge>
                        )}
                        {pkg.is_trending && <Badge className="text-xs bg-red-500">Trending</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{pkg.location}</TableCell>
                  <TableCell>₹{pkg.price}</TableCell>
                  <TableCell>{pkg.duration_hours} hours</TableCell>
                  <TableCell>
                    {pkg.available_spots}/{pkg.max_capacity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.is_available ? "default" : "secondary"}>
                      {pkg.is_available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/packages/${pkg.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/packages/${pkg.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
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
