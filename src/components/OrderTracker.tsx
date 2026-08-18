"use client";

import { useEffect, useState } from "react";
import { formatPKR, STATUS_LABELS } from "@/lib/utils";
import LaceLoader from "@/components/LaceLoader";

// The order the customer's status timeline moves through. CANCELED is
// shown separately since it can happen from any earlier state.
const TIMELINE_STATUSES = [
  "PENDING",
  "BEING_PREPARED",
  "PREPARED",
  "ON_THE_WAY",
  "MIGHT_BE_DELIVERED_TODAY",
  "DELIVERED",
];

type OrderData = {
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  shippingCity: string;
  courier: { name: string; phone: string | null } | null;
  items: { id: string; quantity: number; colorName: string | null; product: { title: string } }[];
  statusHistory: { id: string; status: string; createdAt: string }[];
};

// Polls the order every 8 seconds so the customer sees status changes the
// admin makes without needing to refresh the page — a lightweight way to
// deliver "real-time" tracking without extra infrastructure (a websocket
// or push-based system could later replace the interval below).
export default function OrderTracker({ orderNumber }: { orderNumber: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchOrder() {
      const res = await fetch(`/api/orders/${orderNumber}`);
      const data = await res.json();
      if (!active) return;
      if (!res.ok) setError(data.error || "Could not load this order.");
      else setOrder(data);
    }

    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderNumber]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!order) {
    return (
      <div className="flex justify-center py-24">
        <LaceLoader />
      </div>
    );
  }

  const canceled = order.status === "CANCELED";
  const currentIndex = TIMELINE_STATUSES.indexOf(order.status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink dark:text-cream">{order.orderNumber}</h1>
          <p className="text-sm text-ink-muted dark:text-cream-muted">
            {order.shippingAddress}, {order.shippingCity}
          </p>
        </div>
        <span className="rounded-full bg-wine/10 dark:bg-gold/10 px-3 py-1 text-xs font-medium text-wine dark:text-gold">
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* ---------- STATUS TIMELINE ---------- */}
      {canceled ? (
        <p className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
          This order was canceled.
        </p>
      ) : (
        <ol className="space-y-4 mb-8">
          {TIMELINE_STATUSES.map((status, i) => {
            const reached = i <= currentIndex;
            return (
              <li key={status} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    reached
                      ? "bg-wine dark:bg-gold text-cream dark:text-charcoal"
                      : "bg-wine/10 dark:bg-gold/10 text-ink-muted dark:text-cream-muted"
                  }`}
                >
                  {reached ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm ${
                    reached ? "text-ink dark:text-cream font-medium" : "text-ink-muted dark:text-cream-muted"
                  }`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {order.courier && (
        <p className="mb-6 text-sm text-ink-muted dark:text-cream-muted">
          Courier: <span className="text-ink dark:text-cream">{order.courier.name}</span>
          {order.courier.phone ? ` · ${order.courier.phone}` : ""}
        </p>
      )}

      <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-4">
        <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-2">Items</h2>
        {order.items.map((i) => (
          <p key={i.id} className="text-sm text-ink-muted dark:text-cream-muted">
            {i.product.title} × {i.quantity}
            {i.colorName ? ` (${i.colorName})` : ""}
          </p>
        ))}
        <p className="mt-2 font-display text-wine dark:text-gold">{formatPKR(order.total)}</p>
        <p className="text-xs text-ink-muted dark:text-cream-muted mt-1">{order.paymentMethod}</p>
      </div>
    </div>
  );
}
