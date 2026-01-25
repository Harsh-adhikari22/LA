"use client"

import { useState } from "react"
import { toast } from "@/hooks/use-toast"

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

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">{editing ? "Edit Category" : "Add Category"}</h2>

        <input
          placeholder="Title"
          className="border p-2 w-full"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {editing?.image_url && !file && (
          <img
            src={editing.image_url}
            className="w-40 rounded border"
            alt="Current"
          />
        )}

        <div className="flex gap-2">
          <button onClick={submit} className="px-3 py-1 border rounded">
            {editing ? "Update" : "Create"}
          </button>

          {editing && (
            <button onClick={reset} className="px-3 py-1 border rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.title}</td>
              <td>{c.description}</td>

              <td>
                <img src={c.image_url} className="w-20 rounded border" />
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
                  className="underline"
                >
                  Edit
                </button>

                <button onClick={() => del(c.id)} className="underline text-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
