import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// Couriers and admins can both access the courier portal (an admin covering
// for a courier, or checking on deliveries, shouldn't be locked out).
export async function requireCourierPage() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - role added in lib/auth.ts session callback
  const role = session?.user?.role as string | undefined;

  if (!session) redirect("/login?next=/courier");
  if (role !== "COURIER" && role !== "ADMIN") redirect("/");

  return session;
}

export async function getCourierSession() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id/role added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  // @ts-expect-error - role added in lib/auth.ts session callback
  const role = session?.user?.role as string | undefined;
  if (!session || !userId || (role !== "COURIER" && role !== "ADMIN")) return null;
  return { userId, role, session };
}
