"use client"

import { useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

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

  return (
    <div className="space-y-4">
      <input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Paid</th>
            <th>Admin</th>
            <th>Banned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((u) => {
            const paid = u.orders.filter((o: any) => o.status === "success").length

            return (
              <tr key={u.id} className="border-t">
                <td className="p-2">
                  <Link href={`/admin/users/${u.id}`} className="underline">
                    {u.full_name || "—"}
                  </Link>
                </td>

                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="text-center">{paid}</td>

                <td className="text-center">{u.is_admin ? "Yes" : "No"}</td>
                <td className="text-center">{u.is_banned ? "Yes" : "No"}</td>

                <td className="space-x-2 text-center">
                  <button
                    disabled={loadingId === u.id}
                    onClick={() => act(u.id, u.is_admin ? "demote" : "promote")}
                    className="underline"
                  >
                    {u.is_admin ? "Demote" : "Promote"}
                  </button>

                  <button
                    disabled={loadingId === u.id}
                    onClick={() => act(u.id, u.is_banned ? "unban" : "ban")}
                    className="underline text-red-600"
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
  )
}
