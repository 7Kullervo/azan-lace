"use client";

import { useEffect, useState } from "react";
import { formatPKR, STATUS_LABELS } from "@/lib/utils";
import LaceLoader from "@/components/LaceLoader";

type Courier = { id: string; name: string; email: string };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  paid: boolean;
  courierId: string | null;
  courier: Courier | null;
  customer: { name: string; phone: string | null };
  shippingAddress: string;
  shippingCity: string;
  items: { id: string; quantity: number; product: { title: string } }[];
  createdAt: string;
};

// The five status buttons requested for the admin panel, in the order
// they'd naturally be clicked, plus Canceled available at any point.
const STATUS_BUTTONS: { status: string; tone: string }[] = [
  { status: "BEING_PREPARED", tone: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  { status: "PREPARED", tone: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { status: "ON_THE_WAY", tone: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" },
  { status: "MIGHT_BE_DELIVERED_TODAY", tone: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  { status: "DELIVERED", tone: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { status: "CANCELED", tone: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    const [ordersRes, couriersRes] = await Promise.all([
      fetch("/api/admin/orders").then((r) => r.json()),
      fetch("/api/admin/couriers").then((r) => r.json()),
    ]);
    setOrders(ordersRes);
    setCouriers(couriersRes);
  }

  useEffect(() => {
    load();
    // Real-time-ish updates for the admin too — picks up new orders and any
    // status changes a courier makes from their own portal.
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  async function setStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setUpdating(null);
  }

  async function assignCourier(orderId: string, courierId: string) {
    setUpdating(orderId);
    await fetch(`/api/admin/orders/${orderId}/assign-courier`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courierId: courierId || null }),
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

  if (orders.length === 0) {
    return (
      <p className="text-sm text-ink-muted dark:text-cream-muted">No orders have been placed yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-wine/10 dark:border-gold/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-body font-semibold text-ink dark:text-cream">{order.orderNumber}</p>
              <p className="text-xs text-ink-muted dark:text-cream-muted">
                {order.customer.name} · {order.customer.phone ?? "no phone on file"}
              </p>
              <p className="text-xs text-ink-muted dark:text-cream-muted">
                {order.shippingAddress}, {order.shippingCity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display text-wine dark:text-gold">{formatPKR(order.total)}</p>
              <p className="text-xs text-ink-muted dark:text-cream-muted">
                {order.paymentMethod} {order.paid ? "(paid)" : "(unpaid)"}
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs text-ink-muted dark:text-cream-muted">
            {order.items.map((i) => `${i.product.title} × ${i.quantity}`).join(", ")}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-muted dark:text-cream-muted mr-1">
              Current: <strong className="text-ink dark:text-cream">{STATUS_LABELS[order.status]}</strong>
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {STATUS_BUTTONS.map((b) => (
              <button
                key={b.status}
                disabled={updating === order.id || order.status === b.status}
                onClick={() => setStatus(order.id, b.status)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-opacity disabled:opacity-40 ${b.tone}`}
              >
                {STATUS_LABELS[b.status]}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-ink-muted dark:text-cream-muted">Courier:</label>
            <select
              value={order.courierId ?? ""}
              onChange={(e) => assignCourier(order.id, e.target.value)}
              disabled={updating === order.id}
              className="rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2 py-1 text-xs text-ink dark:text-cream focus:outline-none"
            >
              <option value="">Unassigned</option>
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
