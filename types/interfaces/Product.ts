import { ProductType } from '../enums/ProductType';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  type: ProductType;
  quantity: number;
  donut_ids: string[];
  is_active: boolean;
  is_discounted: boolean;
  discount_price_cents: number;
  is_featured: boolean;
  created_at: string;
  start_at: string | null;
  end_at: string | null;
  features: string[];
  color: string | null;
}
