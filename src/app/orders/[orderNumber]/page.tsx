import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import OrderTracker from "@/components/OrderTracker";

export default async function OrderTrackingPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/login?next=/orders/${orderNumber}`);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <OrderTracker orderNumber={orderNumber} />
    </div>
  );
}
