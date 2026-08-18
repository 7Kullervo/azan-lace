import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, profileImage: true, createdAt: true },
  });

  return NextResponse.json(user);
}

// Updates the logged-in user's name, phone, and/or profile picture path.
// The picture itself is uploaded separately via /api/upload, which returns
// a path that gets passed here.
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: "Not logged in." }, { status: 401 });

  const body = await req.json();
  const { name, phone, profileImage } = body as {
    name?: string;
    phone?: string;
    profileImage?: string;
  };

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(profileImage ? { profileImage } : {}),
    },
    select: { id: true, name: true, email: true, phone: true, profileImage: true },
  });

  return NextResponse.json(user);
}
