import { ProductType } from '../enums/ProductType';

export interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: ProductType;
  quantity: number;
  donut_ids: string[];
  is_active: boolean;
  is_discounted: boolean;
  discount_price_cents: number;
  is_featured: boolean;
  created_at: string;
  start_at: string;
  end_at: string;
  features: string[];
}
