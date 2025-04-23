export interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: string;
  quantity: number;
  image_url: string;
  is_active: boolean;
  is_discounted: boolean;
  discount_price_cents: number;
  is_featured: boolean;
  created_at: string;
}
