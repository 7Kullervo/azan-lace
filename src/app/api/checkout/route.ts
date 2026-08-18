import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { z } from "zod";

const itemSchema = z.object({
  productId: z.string(),
  colorId: z.string().nullable(),
  colorName: z.string().nullable(),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0),
  unit: z.string(),
});

const checkoutSchema = z.object({
  items: z.array(itemSchema).min(1),
  paymentMethod: z.enum(["EASYPAISA", "COD"]),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error - id added in lib/auth.ts session callback
  const userId = session?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: "Please log in to place an order." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid order data." }, { status: 400 });
  }
  const data = parsed.data;

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = 0; // flat free shipping for now — change here if you introduce a shipping fee
  const total = subtotal + shippingFee;

  // Make sure the order number is unique (extremely unlikely to collide, but check anyway).
  let orderNumber = generateOrderNumber();
  while (await prisma.order.findUnique({ where: { orderNumber } })) {
    orderNumber = generateOrderNumber();
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: userId,
      paymentMethod: data.paymentMethod,
      paid: false, // COD is marked paid on delivery by the admin; Easypaisa is marked paid once the payment webhook confirms it (see note below)
      subtotal,
      shippingFee,
      total,
      shippingName: data.shippingName,
      shippingPhone: data.shippingPhone,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      items: {
        create: data.items.map((i) => ({
          productId: i.productId,
          colorName: i.colorName,
          quantity: i.quantity,
          unitPrice: i.price,
          unit: i.unit as any,
        })),
      },
      statusHistory: { create: { status: "PENDING", note: "Order placed by customer" } },
    },
    include: { customer: true },
  });

  // Let the customer know their order was received, on whichever channels
  // are configured (see src/lib/notifications.ts) — same mechanism used
  // for every later status change, so this is consistent end-to-end.
  notifyOrderStatusChange({
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    customerPhone: order.customer.phone,
    orderNumber: order.orderNumber,
    status: "PENDING",
  }).catch((err) => console.error("[notify] failed:", err));

  // Reduce stock for each purchased item (and its color, if applicable).
  for (const item of data.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
    if (item.colorId) {
      await prisma.productColor.update({
        where: { id: item.colorId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  // ============================================================
  // EASYPAISA INTEGRATION POINT
  // ------------------------------------------------------------
  // This is where you redirect the customer into Easypaisa's hosted
  // checkout (or call their API) once you have real merchant
  // credentials in .env (EASYPAISA_MERCHANT_ID / STORE_ID / HASH_KEY).
  // Their integration guide will give you the exact request format;
  // typically you'll build a signed payment request here and return
  // its redirect URL to the client instead of just the order.
  //
  // if (data.paymentMethod === "EASYPAISA") {
  //   const paymentUrl = await createEasypaisaPaymentRequest(order);
  //   return NextResponse.json({ orderNumber: order.orderNumber, redirectUrl: paymentUrl }, { status: 201 });
  // }
  // ============================================================

  return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
}
