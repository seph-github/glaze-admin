import { createClient } from '@/lib/supabase/server';

export default async function FeaturedProduct() {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('shop_products')
    .select('*')
    .eq('type', 'featured')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!product) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow">
      <div className="text-sm">⏰ Limited Time Offer</div>
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-sm mt-1">{product.description}</p>
      <p className="text-lg font-semibold mt-2">
        ${(product.price_cents / 100).toFixed(2)}
      </p>
      <button className="mt-3 w-full bg-white text-orange-600 font-semibold py-2 rounded">
        Buy Premium
      </button>
    </div>
  );
}
