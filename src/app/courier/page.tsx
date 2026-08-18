import { requireCourierPage } from "@/lib/courier-guard";
import CourierPortalClient from "@/components/CourierPortalClient";

export default async function CourierPortalPage() {
  await requireCourierPage();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink dark:text-cream mb-8">Courier Portal</h1>
      <CourierPortalClient />
    </div>
  );
}
