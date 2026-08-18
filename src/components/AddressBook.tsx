"use client";

import { useEffect, useState } from "react";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  isDefault: boolean;
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/user/addresses").then((r) => r.json()).then((data) => setAddresses(Array.isArray(data) ? data : []));
  }

  useEffect(load, []);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Could not save address.");
      return;
    }
    setForm({ label: "Home", fullName: "", phone: "", line1: "", city: "" });
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-body font-semibold text-sm text-ink dark:text-cream">
          Saved Addresses
        </h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs text-wine dark:text-gold hover:underline"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 space-y-2 rounded-xl bg-wine/5 dark:bg-gold/5 p-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="Label (e.g. Home)"
              value={form.label}
              onChange={(e) => update("label", e.target.value)}
              className="rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2.5 py-2 text-xs text-ink dark:text-cream focus:outline-none"
            />
            <input
              required
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2.5 py-2 text-xs text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <input
            required
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2.5 py-2 text-xs text-ink dark:text-cream focus:outline-none"
          />
          <input
            required
            placeholder="Address line"
            value={form.line1}
            onChange={(e) => update("line1", e.target.value)}
            className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2.5 py-2 text-xs text-ink dark:text-cream focus:outline-none"
          />
          <input
            required
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-surface dark:bg-charcoal-surface px-2.5 py-2 text-xs text-ink dark:text-cream focus:outline-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-wine dark:bg-gold px-4 py-1.5 text-xs font-semibold text-cream dark:text-charcoal disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {addresses === null ? (
          <p className="text-xs text-ink-muted dark:text-cream-muted">Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="text-xs text-ink-muted dark:text-cream-muted">
            No saved addresses yet — add one to speed up checkout.
          </p>
        ) : (
          addresses.map((a) => (
            <div key={a.id} className="flex items-start justify-between rounded-lg border border-wine/10 dark:border-gold/10 p-2.5 text-xs">
              <div>
                <p className="font-medium text-ink dark:text-cream">
                  {a.label} {a.isDefault && <span className="text-wine dark:text-gold">· Default</span>}
                </p>
                <p className="text-ink-muted dark:text-cream-muted">
                  {a.fullName}, {a.line1}, {a.city}
                </p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-ink-muted dark:text-cream-muted hover:text-wine dark:hover:text-gold"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
