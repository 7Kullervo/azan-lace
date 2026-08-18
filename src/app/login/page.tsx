"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LaceLoader from "@/components/LaceLoader";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push(next);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-6 py-16">
      <div className="w-full animate-fade-up rounded-3xl border border-wine/10 dark:border-gold/10 bg-surface dark:bg-charcoal-surface p-8 shadow-sm">
        <h1 className="font-display text-2xl text-center text-wine dark:text-gold mb-1">
          Welcome Back
        </h1>

        <p className="text-center text-sm text-ink-muted dark:text-cream-muted mb-6">
          Log in to track orders and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink dark:text-cream mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2.5 text-sm text-ink dark:text-cream focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-wine dark:bg-gold px-6 py-3 text-sm font-semibold text-cream dark:text-charcoal transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <LaceLoader size={18} /> : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-cream-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-wine dark:text-gold font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}