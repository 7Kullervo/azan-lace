import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPKR, UNIT_LABELS } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { colors: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink dark:text-cream">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-wine dark:bg-gold px-5 py-2 text-sm font-semibold text-cream dark:text-charcoal"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-wine/10 dark:border-gold/10">
        <table className="w-full text-sm">
          <thead className="bg-wine/5 dark:bg-gold/5 text-left text-ink-muted dark:text-cream-muted">
            <tr>
              <th className="p-3 font-medium">Photo</th>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Stock</th>
              <th className="p-3 font-medium">Unit</th>
              <th className="p-3 font-medium">Colors</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-wine/10 dark:border-gold/10">
                <td className="p-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-ivory dark:bg-charcoal">
                    <Image src={p.thumbnail} alt={p.title} fill className="object-cover" />
                  </div>
                </td>
                <td className="p-3 text-ink dark:text-cream">{p.title}</td>
                <td className="p-3 text-ink dark:text-cream">{formatPKR(p.price)}</td>
                <td className="p-3 text-ink dark:text-cream">{p.stock}</td>
                <td className="p-3 text-ink-muted dark:text-cream-muted">{UNIT_LABELS[p.unit]}</td>
                <td className="p-3 text-ink-muted dark:text-cream-muted">{p.colors.length}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.active
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-ink-muted/10 text-ink-muted dark:text-cream-muted"
                    }`}
                  >
                    {p.active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-wine dark:text-gold hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-ink-muted dark:text-cream-muted">
                  No products yet — add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
