'use client';

import { ProductType } from '@/types/enums/ProductType';
import { Product } from '@/types/interfaces/Products';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || '');
  const [type, setType] = useState<ProductType>(product.type);
  const [price, setPrice] = useState((product.price_cents / 100).toString());
  const [discountPrice, setDiscountPrice] = useState(
    product.discount_price_cents
      ? (product.discount_price_cents / 100).toString()
      : ''
  );
  const [quantity, setQuantity] = useState(product.quantity?.toString() || '0');
  const [isFeatured, setIsFeatured] = useState(product.is_featured || false);
  const [isActive, setIsActive] = useState(product.is_active ?? true);
  const [isDiscounted, setIsDiscounted] = useState(
    product.is_discounted ?? false
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const productBody: Partial<Product> = {
      name,
      description,
      type,
      price_cents: Math.round(parseFloat(price) * 100),
      discount_price_cents: discountPrice
        ? Math.round(parseFloat(discountPrice) * 100)
        : undefined,
      quantity: Math.round(parseInt(quantity)),
      is_featured: isFeatured,
      is_active: isActive,
      is_discounted: isDiscounted,
    };

    const res = await fetch(`/api/shop/${product.id}`, {
      method: 'PATCH',
      body: JSON.stringify(productBody),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/dashboard/shop');
    } else {
      alert('Update failed.');
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);

    const res = await fetch(`/api/shop/${product.id}`, {
      method: 'DELETE',
    });

    setDeleting(false);
    if (res.ok) {
      router.push('/dashboard/shop');
    } else {
      alert('Delete failed.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-8 rounded shadow"
    >
      <div>
        <label className="block font-medium text-gray-700">Product Type</label>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value as ProductType)}
        >
          <option value={ProductType.Featured}>Featured</option>
          <option value={ProductType.Subscriptions}>Subscription</option>
          <option value={ProductType.DonutBox}>Donut Box</option>
          <option value={ProductType.Bundle}>Bundle</option>
        </select>
      </div>

      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        className="input resize-x"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="input"
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        className="input"
        type="number"
        step="0.01"
        value={discountPrice}
        onChange={(e) => setDiscountPrice(e.target.value)}
      />
      {(type === 'donut_box' || type === 'bundle') && (
        <input
          className="input"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      )}
      {type === 'featured' && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label>Mark as featured</label>
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDiscounted}
            onChange={(e) => setIsDiscounted(e.target.checked)}
          />
          Discounted
        </label>

        {type === 'featured' && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Featured
          </label>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </form>
  );
}
