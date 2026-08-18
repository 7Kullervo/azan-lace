import { NextResponse } from "next/server";
import { getCourierSession } from "@/lib/courier-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courier = await getCourierSession();
  if (!courier) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // A courier sees only their own deliveries. An admin browsing this page
  // sees every order that currently has a courier assigned.
  const orders = await prisma.order.findMany({
    where:
      courier.role === "ADMIN"
        ? { courierId: { not: null } }
        : { courierId: courier.userId },
    include: {
      customer: true,
      items: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
