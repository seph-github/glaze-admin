export interface Donut {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  image_url: string;
  is_default: boolean;
}
