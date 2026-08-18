"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/lib/utils";
import LaceLoader from "@/components/LaceLoader";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "" });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EASYPAISA">("COD");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?next=/checkout");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) setForm((f) => ({ ...f, name: session.user!.name || "" }));
  }, [session]);

  // Prefill from the customer's default saved address, if they have one —
  // saves re-typing the same details on every order.
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((addresses: { isDefault: boolean; fullName: string; phone: string; line1: string; city: string }[]) => {
        const def = Array.isArray(addresses) ? addresses.find((a) => a.isDefault) : null;
        if (def) {
          setForm((f) => ({
            ...f,
            name: def.fullName || f.name,
            phone: def.phone,
            address: def.line1,
            city: def.city,
          }));
        }
      })
      .catch(() => {});
  }, [status]);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          colorId: i.colorId,
          colorName: i.colorName,
          quantity: i.quantity,
          price: i.price,
          unit: i.unit,
        })),
        paymentMethod,
        shippingName: form.name,
        shippingPhone: form.phone,
        shippingAddress: form.address,
        shippingCity: form.city,
      }),
    });
    const data = await res.json();
    setPlacing(false);

    if (!res.ok) {
      setError(data.error || "Could not place your order.");
      return;
    }

    if (data.redirectUrl) {
      // Easypaisa hosted checkout, once wired up (see api/checkout/route.ts)
      window.location.href = data.redirectUrl;
      return;
    }

    clearCart();
    router.push(`/orders/${data.orderNumber}`);
  }

  if (status === "loading" || items.length === 0) {
    return (
      <div className="flex justify-center py-24">
        {status === "loading" ? <LaceLoader /> : <p className="text-ink-muted dark:text-cream-muted">Your cart is empty.</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink dark:text-cream mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream">Shipping Details</h2>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Phone</label>
            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="03xx-xxxxxxx"
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Address</label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>

          <div>
            <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-2">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 rounded-lg border border-wine/20 dark:border-gold/30 p-3 text-sm text-ink dark:text-cream cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-wine/20 dark:border-gold/30 p-3 text-sm text-ink dark:text-cream cursor-pointer">
                <input
                  type="radio"
                  checked={paymentMethod === "EASYPAISA"}
                  onChange={() => setPaymentMethod("EASYPAISA")}
                />
                Easypaisa
              </label>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Order Summary</h2>
          <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-4 space-y-2">
            {items.map((i) => (
              <div key={`${i.productId}-${i.colorId}`} className="flex justify-between text-sm">
                <span className="text-ink dark:text-cream">
                  {i.title} × {i.quantity}
                  {i.colorName ? ` (${i.colorName})` : ""}
                </span>
                <span className="text-ink-muted dark:text-cream-muted">{formatPKR(i.price * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-wine/10 dark:border-gold/10 pt-2 flex justify-between font-display text-wine dark:text-gold">
              <span>Total</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={placing}
            className="mt-4 w-full rounded-full bg-wine dark:bg-gold px-6 py-3 text-sm font-semibold text-cream dark:text-charcoal disabled:opacity-60"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
