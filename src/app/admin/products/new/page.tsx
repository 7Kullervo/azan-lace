import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink dark:text-cream mb-6">Add Product</h1>
      <ProductForm />
    </div>
  );
}
