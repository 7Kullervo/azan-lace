"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { formatPKR, STATUS_LABELS } from "@/lib/utils";
import LaceLoader from "@/components/LaceLoader";
import AddressBook from "@/components/AddressBook";
import { resizeImageForUpload, UnsupportedImageError } from "@/lib/image-resize";
import { safeJson } from "@/lib/safe-json";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; quantity: number; product: { title: string } }[];
};

export default function DashboardClient() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setPhone(data?.phone ?? "");
      });
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []));
  }, []);

  async function handlePictureUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const optimized = await resizeImageForUpload(file, 800); // profile pictures don't need to be large
      const formData = new FormData();
      formData.append("file", optimized);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const { ok, data, rawError } = await safeJson<{ path: string; error?: string }>(uploadRes);

      if (ok && data) {
        const updateRes = await fetch("/api/user/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImage: data.path }),
        });
        const updated = await updateRes.json();
        setProfile(updated);
      } else {
        setUploadError(data?.error || rawError || "Could not upload that photo.");
      }
    } catch (err) {
      setUploadError(
        err instanceof UnsupportedImageError
          ? err.message
          : "Something went wrong preparing that image. Please try a different photo."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const updated = await res.json();
    setProfile(updated);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  if (!profile) {
    return (
      <div className="flex justify-center py-24">
        <LaceLoader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink dark:text-cream mb-8">{t("myAccount")}</h1>

      <div className="grid gap-10 md:grid-cols-3">
        {/* ---------- PROFILE ---------- */}
        <div className="md:col-span-1">
          <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-6 text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal"
              aria-label="Change profile picture"
            >
              {profile.profileImage ? (
                <Image src={profile.profileImage} alt={profile.name} fill className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center font-display text-2xl text-wine dark:text-gold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <LaceLoader size={28} />
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-wine dark:text-gold hover:underline"
            >
              Change photo
            </button>
            {uploadError && (
              <p className="mt-2 text-xs text-red-600 text-left">{uploadError}</p>
            )}

            <h2 className="mt-4 font-body font-semibold text-ink dark:text-cream">{profile.name}</h2>
            <p className="text-sm text-ink-muted dark:text-cream-muted">{profile.email}</p>

            <form onSubmit={handleSaveDetails} className="mt-4 text-left">
              <label className="block text-xs font-medium text-ink dark:text-cream mb-1">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03xx-xxxxxxx"
                className="w-full rounded-lg border border-wine/20 dark:border-gold/30 bg-ivory dark:bg-charcoal px-3 py-2 text-sm text-ink dark:text-cream focus:outline-none"
              />
              <button
                type="submit"
                disabled={saving}
                className="mt-2 w-full rounded-full bg-wine dark:bg-gold px-4 py-2 text-xs font-semibold text-cream dark:text-charcoal disabled:opacity-60"
              >
                {saving ? "Saving..." : savedMsg ? "Saved ✓" : "Save"}
              </button>
            </form>
          </div>

          <div className="mt-6">
            <AddressBook />
          </div>
        </div>

        {/* ---------- ORDERS ---------- */}
        <div className="md:col-span-2">
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-4">
            {t("myOrders")}
          </h2>

          {orders === null ? (
            <div className="flex justify-center py-10">
              <LaceLoader size={36} />
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-8 text-center text-sm text-ink-muted dark:text-cream-muted">
              You haven&apos;t placed any orders yet. Once checkout is enabled, your
              orders and their live status will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.orderNumber}`}
                  className="block rounded-2xl border border-wine/10 dark:border-gold/10 p-4 hover:bg-wine/5 dark:hover:bg-gold/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body font-medium text-sm text-ink dark:text-cream">
                      {order.orderNumber}
                    </span>
                    <span className="rounded-full bg-wine/10 dark:bg-gold/10 px-3 py-1 text-xs font-medium text-wine dark:text-gold">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted dark:text-cream-muted">
                    {order.items.map((i) => `${i.product.title} × ${i.quantity}`).join(", ")}
                  </p>
                  <p className="mt-2 font-display text-wine dark:text-gold">{formatPKR(order.total)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
