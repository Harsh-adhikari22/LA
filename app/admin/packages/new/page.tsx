import { PackageForm } from "@/components/admin/package-form"

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[#d4af37] lit-affairs-font drop-shadow-[0_0_18px_rgba(212,175,55,0.8)]">
          Create New Package
        </h1>
        <p className="text-[#f2d47a]">Add a new party package to your catalog</p>
      </div>

      <PackageForm mode="create" />
    </div>
  )
}
