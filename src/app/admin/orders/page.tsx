import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink dark:text-cream mb-6">Orders</h1>
      <OrdersTable />
    </div>
  );
}
