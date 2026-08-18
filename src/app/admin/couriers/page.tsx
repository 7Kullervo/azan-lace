"use client";

import { useEffect, useState } from "react";

type Courier = { id: string; name: string; email: string; phone: string | null };

export default function AdminCouriersPage() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function load() {
    fetch("/api/admin/couriers").then((r) => r.json()).then(setCouriers);
  }

  useEffect(load, []);

  async function handlePromote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/couriers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }
    setEmail("");
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink dark:text-cream mb-2">Couriers</h1>
      <p className="text-sm text-ink-muted dark:text-cream-muted mb-6">
        To add a courier, have them sign up for a normal account first, then promote
        their email below. They'll then show up in the "Assign Courier" list on Orders.
      </p>

      <form onSubmit={handlePromote} className="mb-8 flex max-w-md gap-2">
        <input
          type="email"
          required
          placeholder="courier@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-wine dark:bg-gold px-5 py-2 text-sm font-semibold text-cream dark:text-charcoal disabled:opacity-60"
        >
          {loading ? "Adding..." : "Make Courier"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="space-y-2">
        {couriers.map((c) => (
          <div key={c.id} className="rounded-xl border border-wine/10 dark:border-gold/10 p-3 text-sm">
            <p className="font-medium text-ink dark:text-cream">{c.name}</p>
            <p className="text-xs text-ink-muted dark:text-cream-muted">
              {c.email} {c.phone ? `· ${c.phone}` : ""}
            </p>
          </div>
        ))}
        {couriers.length === 0 && (
          <p className="text-sm text-ink-muted dark:text-cream-muted">No couriers added yet.</p>
        )}
      </div>
    </div>
  );
}
