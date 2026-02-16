import UsersAdminTable from "@/components/admin/UsersAdminTable";
import { fetchServer } from "@/services/serverApi";

export const revalidate = 30;

export default async function AdminUsersPage() {
  const users = await fetchServer<any[]>("/api/users");

  return <UsersAdminTable users={users} />;
}
