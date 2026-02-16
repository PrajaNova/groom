import ConfessionsAdminTable from "@/components/admin/ConfessionsAdminTable";
import { fetchServer } from "@/services/serverApi";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminConfessionsPage() {
  const confessions = await fetchServer<any[]>("/api/confessions");

  const confessionRows = confessions.map((c: any) => ({
    id: String(c.id ?? ""),
    slug: String(c.id ?? ""),
    content: String(c.content ?? ""),
  }));

  return <ConfessionsAdminTable confessions={confessionRows} />;
}
