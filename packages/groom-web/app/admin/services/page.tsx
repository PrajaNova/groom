import ServicesAdminTable from "@/components/admin/ServicesAdminTable";
import { fetchServer } from "@/services/serverApi";

export const revalidate = 0; // Always fetch fresh data for admin

export default async function AdminServicesPage() {
  const services = await fetchServer<any[]>("/api/services");

  return (
    <div className="space-y-6">
      <ServicesAdminTable services={services} />
    </div>
  );
}
