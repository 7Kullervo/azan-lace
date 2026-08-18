import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { orderNumber: string } }) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id/role added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  // @ts-expect-error - role added in lib/auth.ts session callback
  const role = session?.user?.role as string | undefined;
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      courier: { select: { name: true, phone: true } },
    },
  });

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // Customers can only view their own orders; admins can view any order.
  if (order.customerId !== userId && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}
