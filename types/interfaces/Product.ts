import { ProductType } from '../enums/ProductType';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  type: ProductType;
  quantity: number | null;
  donut_ids: string[];
  is_active: boolean;
  is_discounted: boolean;
  discount_price_cents: number | null;
  is_featured: boolean;
  created_at: string;
  start_at: string | null;
  end_at: string | null;
  color: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  synced: boolean;
}
