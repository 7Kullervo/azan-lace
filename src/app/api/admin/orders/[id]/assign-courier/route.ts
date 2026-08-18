import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ courierId: z.string().nullable() });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });

  const order = await prisma.order.update({
    where: { id },
    data: { courierId: parsed.data.courierId },
    include: { courier: true },
  });

  return NextResponse.json(order);
}
