import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Products } from '@/types/interfaces/Products';
import Image from 'next/image';

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = (await supabase
    .rpc('get_products')
    // .from('shop_products')
    // .select('*')
    .order('created_at', { ascending: false })) as { data: Products[] };

  console.log('Products ' + products);

  function hexToRGBA(hex: string, alpha = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Donut Shop Products
        </h1>
        <div className="flex gap-x-4">
          <Link
            href="/dashboard/shop/donuts"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded shadow transition"
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

      <div className="grid grid-cols-2 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="flex flex-cols-3 gap-4 p-4 shadow rounded relative"
            style={{
              backgroundColor: hexToRGBA(product.color || '#FFFFFF', 0.4),
            }}
          >
            {/* Column 1: Donut Images (stacked vertically) */}
            <div className="flex flex-col gap-2">
              {product.donuts?.map((donut) => (
                <div
                  key={donut.id}
                  className="w-[50px] h-[50px] relative rounded overflow-hidden"
                >
                  <Image
                    src={donut.image_url}
                    alt={donut.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Column 2: Product Details */}
            <div className="flex-1 space-y-1">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-700">{product.description}</p>
              <p className="text-sm">
                Price: ${(product.price_cents / 100).toFixed(2)}
              </p>
              <p className="text-sm">Quantity: {product.quantity}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(product.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Column 3: Product Type */}
            <div className="relative flex flex-col justify-start flex-1 text-sm text-gray-500 capitalize">
              <div className="mb-2 font-bold text-pink-500">{product.type}</div>
              {product.features?.map((feature) => (
                <li key={feature.name} className="text-sm text-gray-700">
                  {feature.name}
                </li>
              ))}

              <Link
                href={`/dashboard/shop/${product.id}/edit`}
                className="absolute bottom-2 right-2 text-blue-600 text-sm hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
