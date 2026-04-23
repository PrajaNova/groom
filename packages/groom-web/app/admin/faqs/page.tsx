import FAQsAdminTable from "@/components/admin/FAQsAdminTable";
import { fetchServer } from "@/services/serverApi";

export const revalidate = 0; // Always fetch fresh data for admin

export default async function AdminFAQsPage() {
  const faqs = await fetchServer<any[]>("/api/faqs");

  return (
    <div className="space-y-6">
      <FAQsAdminTable faqs={faqs} />
    </div>
  );
}
