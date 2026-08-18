"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LaceLoader from "@/components/LaceLoader";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Automatically log the new user in and take them to their dashboard.
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
      <div className="w-full animate-fade-up rounded-3xl border border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface p-8 shadow-sm">
        <h1 className="font-display text-2xl text-center text-wine dark:text-gold mb-1">
          Create Your Account
        </h1>
        <p className="text-center text-sm text-ink-muted dark:text-cream-muted mb-6">
          Track orders, save addresses, and check out faster.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Full Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-wine dark:bg-gold px-6 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <LaceLoader size={18} /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-cream-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-wine dark:text-gold font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
