import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

async function getUserId() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  return session?.user?.id as string | undefined;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }],
  });
  return NextResponse.json(addresses);
}

const schema = z.object({
  label: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid address." }, { status: 400 });
  }

  // If this is marked default (or it's the user's first address), clear any
  // existing default so there's only ever one.
  const existingCount = await prisma.address.count({ where: { userId } });
  if (parsed.data.isDefault || existingCount === 0) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId, isDefault: parsed.data.isDefault || existingCount === 0 },
  });

  return NextResponse.json(address, { status: 201 });
}
