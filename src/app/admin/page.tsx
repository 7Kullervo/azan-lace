import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPKR, STATUS_LABELS } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [productCount, pendingCount, orders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
  ]);

  const lowStock = await prisma.product.findMany({
    where: { active: true, stock: { lte: 5 } },
    take: 5,
  });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink dark:text-cream mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
          <p className="text-xs text-ink-muted dark:text-cream-muted">Active Products</p>
          <p className="font-display text-3xl text-wine dark:text-gold mt-1">{productCount}</p>
        </div>
        <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
          <p className="text-xs text-ink-muted dark:text-cream-muted">Pending Orders</p>
          <p className="font-display text-3xl text-wine dark:text-gold mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-wine/10 dark:border-gold/10 p-5">
          <p className="text-xs text-ink-muted dark:text-cream-muted">Low Stock (≤5)</p>
          <p className="font-display text-3xl text-wine dark:text-gold mt-1">{lowStock.length}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Recent Orders</h2>
          <div className="space-y-2">
            {orders.length === 0 && (
              <p className="text-sm text-ink-muted dark:text-cream-muted">No orders yet.</p>
            )}
            {orders.map((o) => (
              <Link
                key={o.id}
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl border border-wine/10 dark:border-gold/10 p-3 text-sm hover:bg-wine/5 dark:hover:bg-gold/10"
              >
                <div>
                  <p className="font-medium text-ink dark:text-cream">{o.orderNumber}</p>
                  <p className="text-xs text-ink-muted dark:text-cream-muted">{o.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-wine dark:text-gold font-display">{formatPKR(o.total)}</p>
                  <p className="text-xs text-ink-muted dark:text-cream-muted">
                    {STATUS_LABELS[o.status]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-body font-semibold text-sm text-ink dark:text-cream mb-3">Low Stock</h2>
          <div className="space-y-2">
            {lowStock.length === 0 && (
              <p className="text-sm text-ink-muted dark:text-cream-muted">Everything is well stocked.</p>
            )}
            {lowStock.map((p) => (
              <Link
                key={p.id}
                href="/admin/products"
                className="flex items-center justify-between rounded-xl border border-wine/10 dark:border-gold/10 p-3 text-sm hover:bg-wine/5 dark:hover:bg-gold/10"
              >
                <span className="text-ink dark:text-cream">{p.title}</span>
                <span className="text-wine dark:text-gold">{p.stock} left</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
