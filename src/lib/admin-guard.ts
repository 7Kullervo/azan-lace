import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// Use in admin PAGES (redirects to login instead of returning JSON).
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - role added in lib/auth.ts session callback
  const role = session?.user?.role as string | undefined;

  if (!session) redirect("/login?next=/admin");
  if (role !== "ADMIN") redirect("/");

  return session;
}

// Use in admin API ROUTES (returns null instead of redirecting; the
// caller responds with a 401/403 JSON error).
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - role added in lib/auth.ts session callback
  const role = session?.user?.role as string | undefined;
  if (!session || role !== "ADMIN") return null;
  return session;
}
