import { ProductType } from '../enums/ProductType';

export interface Features {
  id: string;
  name: string;
  type: ProductType;
  description: string | null;
  price: number | null;
  is_active: boolean;
  feature_key: string;
  created_at: string;
}
