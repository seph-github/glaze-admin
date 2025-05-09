import { ProductType } from '../enums/ProductType';
import { Donut } from './Donut';
import { Features } from './Features';

export interface Products {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  type: ProductType;
  quantity: number;
  donuts: Donut[];
  features: Features[];
  is_active: boolean;
  is_discounted: boolean;
  discount_price_cents: number;
  is_featured: boolean;
  created_at: string;
  start_at: string;
  end_at: string;
  color: string | null;
}
