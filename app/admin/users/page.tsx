import { createClient } from "@/lib/supabase/server"
import UsersTable from "@/components/admin/UsersTable"

export default async function AdminUsersPage() {
  const supabase = createClient()

  const { data: users, error } = await (await supabase)
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      is_admin,
      is_banned,
      orders (
        id,
        status,
        delivery_status
      )
    `)

  if (error) return <div>{error.message}</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <UsersTable users={users ?? []} />
    </div>
  )
}
