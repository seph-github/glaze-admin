import EditProductForm from '@/components/Shop/EditProductForm';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/interfaces/Products';
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <EditProductForm product={product as Product} />
    </div>
  );
}
