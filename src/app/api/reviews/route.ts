import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "You must be logged in to leave a review." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review data." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      userId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
    include: { user: true },
  });

  return NextResponse.json(review, { status: 201 });
}
