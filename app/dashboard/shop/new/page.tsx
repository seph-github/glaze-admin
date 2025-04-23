'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/interfaces/Products';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState('donut_box');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const productBody: Partial<Product> = {
      name,
      type,
      description,
      price_cents: Math.round(parseFloat(price) * 100),
      discount_price_cents: discountPrice
        ? Math.round(parseFloat(discountPrice) * 100)
        : undefined,
      quantity: quantity ? parseInt(quantity) : 0,
      is_featured: isFeatured,
      is_active: isActive,
      is_discounted: isDiscounted,
    };

    const res = await fetch('/api/shop', {
      method: 'POST',
      body: JSON.stringify(productBody),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard/shop');
    } else {
      alert('Failed to create product.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Shop Product</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selector */}
        <div>
          <label className="block font-medium text-gray-700">
            Product Type
          </label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="subscription">Subscription</option>
            <option value="donut_box">Donut Box</option>
            <option value="bundle">Bundle</option>
          </select>
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 p-2 border rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Discount Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 p-2 border rounded"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Quantity (only for donut box/bundle) */}
        {(type === 'donut_box' || type === 'bundle') && (
          <div>
            <label className="block font-medium text-gray-700">
              Quantity (Donuts)
            </label>
            <input
              type="number"
              className="w-full mt-1 p-2 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        )}

        {/* Image URL */}
        <div>
          <label className="block font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {/* Featured Toggle */}
        {type === 'featured' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <label className="text-sm text-gray-700">Mark as Featured</label>
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
