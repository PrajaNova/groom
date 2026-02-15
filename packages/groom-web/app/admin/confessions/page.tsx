import ConfessionsAdminTable from "##/components/admin/ConfessionsAdminTable";

// Revalidate every 60 seconds
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function AdminConfessionsPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/confessions`,
    {
      cache: "no-store",
    },
  );
  const confessions = res.ok ? await res.json() : [];

  const confessionRows = confessions.map((c: any) => {
    return {
      id: String(c.id ?? ""),
      slug: String(c.id ?? ""),
      content: String(c.content ?? ""),
    };
  });

  return <ConfessionsAdminTable confessions={confessionRows} />;
}
