export type ProductColorDTO = {
  id: string;
  name: string;
  hex: string | null;
  stock: number;
};

export type ProductDTO = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: { id: string; path: string }[];
  colors: ProductColorDTO[];
  unit: string;
  active: boolean;
};

// A cart line item, kept on the client (localStorage) for guests and
// synced to the database for logged-in users via /api/cart.
export type CartLineItem = {
  productId: string;
  slug: string;
  title: string;
  thumbnail: string;
  price: number;
  unit: string;
  colorId: string | null;
  colorName: string | null;
  quantity: number;
};
