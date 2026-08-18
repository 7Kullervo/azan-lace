import { requireAdminPage } from "@/lib/admin-guard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage(); // redirects non-admins away before rendering anything below

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-6">{children}</div>
    </div>
  );
}
