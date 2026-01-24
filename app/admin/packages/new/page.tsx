import { PackageForm } from "@/components/admin/package-form"

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Package</h1>
        <p className="text-gray-600">Add a new party package to your catalog</p>
      </div>

      <PackageForm mode="create" />
    </div>
  )
}
