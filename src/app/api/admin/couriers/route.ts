import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const couriers = await prisma.user.findMany({
    where: { role: "COURIER" },
    select: { id: true, name: true, email: true, phone: true },
  });
  return NextResponse.json(couriers);
}

const schema = z.object({ email: z.string().email() });

// Promotes an existing account to COURIER by email. The person should sign
// up as a normal customer first (or the admin can create the account via
// Prisma Studio), then be promoted here.
export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase().trim() } });
  if (!user) {
    return NextResponse.json({ error: "No account found with that email. Ask them to sign up first." }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "COURIER" },
    select: { id: true, name: true, email: true, phone: true },
  });

  return NextResponse.json(updated, { status: 201 });
}
