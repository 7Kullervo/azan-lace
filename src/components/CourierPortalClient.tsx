"use client";

import { useEffect, useState } from "react";
import { formatPKR, STATUS_LABELS } from "@/lib/utils";
import LaceLoader from "@/components/LaceLoader";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  customer: { name: string; phone: string | null };
  items: { id: string; quantity: number; colorName: string | null; product: { title: string } }[];
};

const DELIVERY_STATUS_BUTTONS = [
  { status: "ON_THE_WAY", tone: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { status: "MIGHT_BE_DELIVERED_TODAY", tone: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  { status: "DELIVERED", tone: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
];

// Polls every 10 seconds so newly-assigned deliveries show up automatically
// without the courier needing to refresh — mirrors the customer-facing
// OrderTracker's approach for "real time" updates.
export default function CourierPortalClient() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/courier/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function setStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await fetch(`/api/courier/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  }

  if (!orders) {
    return (
      <div className="flex justify-center py-24">
        <LaceLoader />
      </div>
    );
  }

  const active = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELED");
  const completed = orders.filter((o) => o.status === "DELIVERED" || o.status === "CANCELED");

  return (
    <div>
      <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">
        Active Deliveries ({active.length})
      </h2>
      {active.length === 0 ? (
        <p className="text-sm text-ink-muted dark:text-cream-muted mb-8">
          No deliveries assigned to you right now.
        </p>
      ) : (
        <div className="space-y-4 mb-10">
          {active.map((order) => (
            <div key={order.id} className="rounded-2xl border border-wine/10 dark:border-gold/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-body font-semibold text-ink dark:text-cream">{order.orderNumber}</p>
                  <p className="text-xs text-ink-muted dark:text-cream-muted">
                    {order.customer.name} · {order.customer.phone ?? "no phone on file"}
                  </p>
                  <p className="text-xs text-ink-muted dark:text-cream-muted">
                    {order.shippingAddress}, {order.shippingCity}
                  </p>
                </div>
                <span className="font-display text-wine dark:text-gold shrink-0">{formatPKR(order.total)}</span>
              </div>

              <p className="mt-2 text-xs text-ink-muted dark:text-cream-muted">
                {order.items.map((i) => `${i.product.title} × ${i.quantity}${i.colorName ? ` (${i.colorName})` : ""}`).join(", ")}
              </p>

              <p className="mt-2 text-xs text-ink-muted dark:text-cream-muted">
                Current: <strong className="text-ink dark:text-cream">{STATUS_LABELS[order.status]}</strong>
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {DELIVERY_STATUS_BUTTONS.map((b) => (
                  <button
                    key={b.status}
                    disabled={updating === order.id || order.status === b.status}
                    onClick={() => setStatus(order.id, b.status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-40 ${b.tone}`}
                  >
                    {STATUS_LABELS[b.status]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <>
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">
            Completed ({completed.length})
          </h2>
          <div className="space-y-2">
            {completed.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-wine/10 dark:border-gold/10 p-3 text-sm">
                <span className="text-ink dark:text-cream">{order.orderNumber}</span>
                <span className="text-ink-muted dark:text-cream-muted">{STATUS_LABELS[order.status]}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
