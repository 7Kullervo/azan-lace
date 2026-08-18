import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns the logged-in customer's orders, newest first, with each item
// and the full status history so "My Orders" can render a timeline.
// Will start returning real data as soon as the checkout flow (next
// build phase) starts creating Order rows — no changes needed here.
export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
