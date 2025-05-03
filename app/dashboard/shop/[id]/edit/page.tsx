import EditProductForm from '@/components/Shop/EditProductForm';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/interfaces/Product';
import { notFound } from 'next/navigation';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) return notFound();

  return <EditProductForm product={product as Product} />;
}
