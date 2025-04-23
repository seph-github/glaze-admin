import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('shop_products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Donut Shop Products
        </h1>
        <div className="flex gap-x-4">
          <Link
            href="/dashboard/shop/donuts"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          >
            Show Donuts
          </Link>
          <Link
            href="/dashboard/shop/donuts/new"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
          >
            + Add New Donut
          </Link>
          <Link
            href="/dashboard/shop/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
          >
            + New Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow p-4 rounded space-y-2"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <span className="text-sm text-gray-500 capitalize">
                {product.type}
              </span>
            </div>
            <p className="text-sm text-gray-700">{product.description}</p>
            <p className="text-sm">
              Price: ${(product.price_cents / 100).toFixed(2)}
            </p>
            <p className="text-sm">Quantity: {product.quantity}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(product.created_at).toLocaleDateString()}
            </p>
            <Link
              href={`/dashboard/shop/${product.id}/edit`}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
