import { createClient } from '@/lib/supabase/server';

export default async function DonutBoxesList() {
  const supabase = await createClient();
  const { data: boxes } = await supabase
    .from('shop_products')
    .select('*')
    .eq('type', 'donut_box')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (!boxes?.length) return null;

  return (
    <div className="space-y-4">
      {boxes.map((box) => (
        <div key={box.id} className="bg-zinc-800 text-white p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{box.name}</h3>
              <p className="text-sm text-gray-300">{box.description}</p>
            </div>
            <span className="font-bold">
              ${(box.price_cents / 100).toFixed(2)}
            </span>
          </div>
          <button className="mt-2 w-full bg-zinc-600 hover:bg-zinc-500 py-2 rounded">
            Buy Box
          </button>
        </div>
      ))}
    </div>
  );
}
