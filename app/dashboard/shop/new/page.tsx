'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/interfaces/Products';
import { createBrowserClient } from '@supabase/ssr';
import { Donut } from '@/types/interfaces/Donut';
import Image from 'next/image';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState('donut_box');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [donuts, setDonuts] = useState<Donut[]>([]);
  const [selectedDonuts, setSelectedDonuts] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  // Fetch donuts from DB
  useEffect(() => {
    async function fetchDonuts() {
      const { data, error } = await supabase.from('donuts').select('*');
      if (error) {
        console.error('Failed to fetch donuts:', error);
      } else {
        setDonuts(data || []);
      }
    }
    fetchDonuts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    console.log(features);
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
      is_featured: type === 'featured',
      is_active: isActive,
      is_discounted: isDiscounted,
      donut_ids: selectedDonuts,
      start_at: startDate,
      end_at: endDate,
      features,
    };

    const res = await fetch('/api/shop', {
      method: 'POST',
      body: JSON.stringify(productBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard/shop');
    } else {
      alert('Failed to create product.');
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Shop Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6 bg-white p-8 rounded-xl shadow-md border">
            {/* Type Selector */}
            <div>
              <label className="block font-medium text-gray-700">
                Product Type
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Features Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-gray-700">
                  Product Features
                </label>
                <button
                  type="button"
                  onClick={() => setFeatures((prev) => [...prev, ''])}
                  className="text-pink-600 hover:text-pink-800 text-sm font-semibold"
                >
                  + Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...features];
                        newFeatures[index] = e.target.value;
                        setFeatures(newFeatures);
                      }}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                      required
                    />

                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFeatures(features.filter((_, i) => i !== index))
                        }
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity */}
            {(type === 'donut_box' || type === 'bundle') && (
              <div>
                <label className="block font-medium text-gray-700">
                  Quantity (Donuts)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            )}

            {/* Toggles */}
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

              {/* {type === 'featured' && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Featured
                </label>
              )} */}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 space-y-6 bg-white p-8 rounded-xl shadow-md border">
            {type === 'featured' && (
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700">
                Select Donuts
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-4 border rounded-lg bg-gray-50">
                {donuts.map((donut) => (
                  <button
                    key={donut.id}
                    type="button"
                    onClick={() => {
                      setSelectedDonuts((prev) =>
                        prev.includes(donut.id)
                          ? prev.filter((id) => id !== donut.id)
                          : [...prev, donut.id]
                      );
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg text-xs transition duration-200 ${
                      selectedDonuts.includes(donut.id)
                        ? 'bg-pink-100 border-pink-400 scale-105'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {/* Donut Image */}
                    {donut.image_url ? (
                      <Image
                        src={donut.image_url}
                        alt={donut.name}
                        width={1000}
                        height={1000}
                        className="w-16 h-16 object-cover rounded-full shadow"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full text-gray-400">
                        🍩
                      </div>
                    )}
                    {/* Donut Name */}
                    <span className="font-medium text-gray-700">
                      {donut.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Donut...' : 'Create Donut'}
        </button>
      </form>
    </div>
  );
}
