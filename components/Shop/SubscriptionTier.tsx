import { createClient } from '@/lib/supabase/server';

export default async function SubscriptionTier() {
  const supabase = await createClient();
  const { data: plan } = await supabase
    .from('shop_products')
    .select('*')
    .eq('type', 'subscription')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (!plan) return null;

  return (
    <div className="bg-purple-600 text-white p-6 rounded-xl shadow space-y-2">
      <h2 className="text-xl font-bold">{plan.name}</h2>
      <p className="text-sm">{plan.description}</p>
      <p className="text-lg font-semibold">
        ${(plan.price_cents / 100).toFixed(2)} / month
      </p>
      <button className="w-full bg-pink-500 hover:bg-pink-600 font-semibold py-2 rounded">
        Subscribe Now
      </button>
      <p className="text-xs text-center opacity-75 mt-2">
        * Cancel anytime, no commitment.
      </p>
    </div>
  );
}
