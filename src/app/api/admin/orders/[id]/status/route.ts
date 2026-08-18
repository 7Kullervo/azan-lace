import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { z } from "zod";

const STATUSES = [
  "PENDING",
  "BEING_PREPARED",
  "PREPARED",
  "ON_THE_WAY",
  "MIGHT_BE_DELIVERED_TODAY",
  "DELIVERED",
  "CANCELED",
] as const;

const schema = z.object({
  status: z.enum(STATUSES),
  note: z.string().optional(),
});

// PATCH /api/admin/orders/:id/status
// This is what the "Product Being Prepared / Prepared / On the Way /
// Might Be Delivered Today / Canceled" buttons in the admin order list
// call. Every change is logged to OrderStatusEvent (so the customer's
// "My Orders" timeline stays accurate) and fires all four notification
// channels (Email/SMS/WhatsApp/Push) — see src/lib/notifications.ts.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      statusHistory: { create: { status: parsed.data.status, note: parsed.data.note } },
    },
    include: { customer: true },
  });

  // Fire-and-forget: notification failures never block the status update.
  notifyOrderStatusChange({
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone,
    orderNumber: order.orderNumber,
    status: order.status,
  }).catch((err) => console.error("[notify] failed:", err));

  return NextResponse.json(order);
}
