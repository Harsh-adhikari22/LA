"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { exportToExcel } from "@/lib/export-to-excel"

export default function CategoriesManager({ initial }: { initial: any[] }) {
  const [categories, setCategories] = useState(initial)
  const [editing, setEditing] = useState<any | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
  })

  const reset = () => {
    setEditing(null)
    setFile(null)
    setForm({ title: "", description: "", image_url: "" })
  }

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("bucket", "Categories")

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    return data.publicUrl
  }

  const submit = async () => {
    try {
      let imageUrl = form.image_url

      if (file) {
        imageUrl = await uploadImage(file)
      }

      const payload = editing
        ? { id: editing.id, ...form, image_url: imageUrl }
        : { ...form, image_url: imageUrl }

      const res = await fetch("/api/admin/categories", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast({ title: editing ? "Updated" : "Created" })
      location.reload()
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      })
    }
  }

  const del = async (id: string) => {
    if (!confirm("Delete category?")) return

    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })

    const data = await res.json()
    if (!res.ok)
      return toast({ title: "Error", description: data.error, variant: "destructive" })

    toast({ title: "Deleted" })
    location.reload()
  }

  const handleExport = async () => {
    const data = categories.map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      image_url: c.image_url,
      created_at: c.created_at ? new Date(c.created_at).toLocaleString() : "",
    }))

    await exportToExcel({
      data,
      fileName: "categories",
      sheetName: "Categories",
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="border border-[#b88a22]/40 rounded p-4 space-y-3 bg-white/5 backdrop-blur-xl shadow-[0_0_24px_rgba(212,175,55,0.2)]">
        <h2 className="font-semibold text-[#f2d47a]">{editing ? "Edit Category" : "Add Category"}</h2>

        <input
          placeholder="Title"
          className="border border-[#b88a22]/40 p-2 w-full bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border border-[#b88a22]/40 p-2 w-full bg-black/60 text-[#f2d47a] placeholder:text-[#c9a949]/70"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          className="border border-[#b88a22]/40 p-2 w-full bg-black/60 text-[#f2d47a]"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {editing?.image_url && !file && (
          <img
            src={editing.image_url}
            className="w-40 rounded border border-[#b88a22]/40"
            alt="Current"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={submit}
            className="px-3 py-1 border border-[#b88a22]/60 rounded bg-black/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
          >
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button
              onClick={reset}
              className="px-3 py-1 border border-[#b88a22]/60 rounded bg-black/60 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleExport}
          className="border-[#b88a22]/60 text-[#d4af37] bg-black/60 hover:bg-[#d4af37] hover:text-black transition-all duration-300"
        >
          Export to Excel
        </Button>
      </div>
      <div className="rounded-xl border border-[#b88a22]/40 bg-black/70 backdrop-blur-xl shadow-[0_0_28px_rgba(212,175,55,0.25)] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-black/90">
          <tr>
            <th className="p-2 text-left text-[#f2d47a]">Title</th>
            <th className="text-[#f2d47a]">Description</th>
            <th className="text-[#f2d47a]">Image</th>
            <th className="text-[#f2d47a]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t border-[#b88a22]/30 transition-all duration-300 hover:bg-[#d4af37]/10 hover:shadow-[inset_0_0_18px_rgba(212,175,55,0.35)]">
              <td className="p-2 text-[#f2d47a]">{c.title}</td>
              <td className="text-[#e6c768]">{c.description}</td>

              <td>
                <img src={c.image_url} className="w-20 rounded border border-[#b88a22]/40" />
              </td>

              <td className="space-x-2">
                <button
                  onClick={() => {
                    setEditing(c)
                    setForm({
                      title: c.title,
                      description: c.description ?? "",
                      image_url: c.image_url,
                    })
                  }}
                  className="underline text-[#d4af37] hover:text-[#f2d47a]"
                >
                  Edit
                </button>

                <button onClick={() => del(c.id)} className="underline text-red-300 hover:text-red-200">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
