import TestimonialsAdminTable from "@/components/admin/TestimonialsAdminTable";
import { fetchServer } from "@/services/serverApi";

export const revalidate = 0; // Always fetch fresh data for admin

export default async function AdminTestimonialsPage() {
  const testimonials = await fetchServer<any[]>("/api/testimonials");

  return (
    <div className="space-y-6">
      <TestimonialsAdminTable testimonials={testimonials} />
    </div>
  );
}
