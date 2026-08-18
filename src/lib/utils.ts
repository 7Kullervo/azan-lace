// Formats a whole-number price as Pakistani Rupees, e.g. 4500 -> "Rs. 4,500"
export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

// Human-friendly labels for the MeasurementUnit enum.
// Guz (yard) and Meter are the two primary units per the store's request;
// the rest exist so the admin panel can support other product types later.
export const UNIT_LABELS: Record<string, string> = {
  GUZ: "Guz (Yard)",
  METER: "Meter",
  YARD: "Yard",
  INCH: "Inch",
  CENTIMETER: "Centimeter",
  ROLL: "Roll",
  PIECE: "Piece",
};

// Human-friendly labels + colors for order status badges.
export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  BEING_PREPARED: "Product Being Prepared",
  PREPARED: "Product Prepared",
  ON_THE_WAY: "Product On the Way",
  MIGHT_BE_DELIVERED_TODAY: "Might Be Delivered Today",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};

// Generates a short, human-friendly order reference like "AL-24681"
export function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `AL-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
