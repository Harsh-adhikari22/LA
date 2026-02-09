"use client"

import { useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { exportToExcel } from "@/lib/export-to-excel"

export default function UsersTable({ users }: { users: any[] }) {
  const [query, setQuery] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query) return users
    const q = query.toLowerCase()

    return users.filter((u) =>
      [u.full_name, u.email, u.phone, u.id]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [users, query])

  const act = async (userId: string, action: string) => {
    setLoadingId(userId)

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        body: JSON.stringify({ userId, action }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({ title: "Updated" })
      location.reload()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setLoadingId(null)
    }
  }

  const handleExport = async () => {
    const data = filtered.map((u: any) => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      phone: u.phone,
      paid_orders: u.orders?.filter((o: any) => o.status === "success").length ?? 0,
      is_admin: u.is_admin ? "Yes" : "No",
      is_banned: u.is_banned ? "Yes" : "No",
    }))

    await exportToExcel({
      data,
      fileName: "users",
      sheetName: "Users",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-[#b88a22]/40 rounded px-3 py-2 w-full bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
        />
        <Button
          variant="outline"
          onClick={handleExport}
          className="sm:w-auto border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
        >
          Export to Excel
        </Button>
      </div>

      <div className="rounded-xl border border-[#b88a22]/40 bg-black/70 backdrop-blur-xl shadow-[0_0_28px_rgba(212,175,55,0.25)] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-black/90">
          <tr>
            <th className="p-2 text-left text-[#f2d47a]">Name</th>
            <th className="text-[#f2d47a]">Email</th>
            <th className="text-[#f2d47a]">Phone</th>
            <th className="text-[#f2d47a]">Paid</th>
            <th className="text-[#f2d47a]">Admin</th>
            <th className="text-[#f2d47a]">Banned</th>
            <th className="text-[#f2d47a]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => {
            const paid = u.orders.filter((o: any) => o.status === "success").length

            return (
              <tr key={u.id} className="border-t border-[#b88a22]/30 transition-all duration-300 hover:bg-[#d4af37]/10 hover:shadow-[inset_0_0_18px_rgba(212,175,55,0.35)]">
                <td className="p-2">
                  <Link href={`/admin/users/${u.id}`} className="underline text-[#f2d47a] hover:text-[#d4af37]">
                    {u.full_name || "—"}
                  </Link>
                </td>

                <td className="text-[#e6c768]">{u.email}</td>
                <td className="text-[#e6c768]">{u.phone}</td>
                <td className="text-center text-[#f2d47a]">{paid}</td>

                <td className="text-center text-[#f2d47a]">{u.is_admin ? "Yes" : "No"}</td>
                <td className="text-center text-[#f2d47a]">{u.is_banned ? "Yes" : "No"}</td>

                <td className="space-x-2 text-center">
                  <button
                    disabled={loadingId === u.id}
                    onClick={() => act(u.id, u.is_admin ? "demote" : "promote")}
                    className="underline text-[#d4af37] hover:text-[#f2d47a]"
                  >
                    {u.is_admin ? "Demote" : "Promote"}
                  </button>

                  <button
                    disabled={loadingId === u.id}
                    onClick={() => act(u.id, u.is_banned ? "unban" : "ban")}
                    className="underline text-red-300 hover:text-red-200"
                  >
                    {u.is_banned ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
    </div>
  )
}
