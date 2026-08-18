import { NextRequest, NextResponse } from "next/server";
import { getCourierSession } from "@/lib/courier-guard";
import { prisma } from "@/lib/prisma";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { z } from "zod";

// Couriers only move orders through the delivery-side statuses. Prep-side
// statuses (Being Prepared / Prepared) and Canceled stay admin-only
// decisions — see src/app/api/admin/orders/[id]/status/route.ts for those.
const COURIER_ALLOWED_STATUSES = ["ON_THE_WAY", "MIGHT_BE_DELIVERED_TODAY", "DELIVERED"] as const;

const schema = z.object({ status: z.enum(COURIER_ALLOWED_STATUSES) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const courier = await getCourierSession();
  if (!courier) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status for a courier update." }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  // A courier can only update deliveries assigned to them (admins can update any).
  if (courier.role !== "ADMIN" && existing.courierId !== courier.userId) {
    return NextResponse.json({ error: "This order isn't assigned to you." }, { status: 403 });
  }

  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: parsed.data.status,
      statusHistory: { create: { status: parsed.data.status, note: "Updated by courier" } },
    },
    include: { customer: true },
  });

  notifyOrderStatusChange({
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone,
    orderNumber: order.orderNumber,
    status: order.status,
  }).catch((err) => console.error("[notify] failed:", err));

  return NextResponse.json(order);
}
