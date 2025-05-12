'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/interfaces/Product';
import { Donut } from '@/types/interfaces/Donut';
import Image from 'next/image';
import { ProductType } from '@/types/enums/ProductType';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ProductType>(ProductType.Bundle);
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
  const [selectedColor, setSelectedColor] = useState('');
  const [availableFeatures, setAvailableFeatures] = useState<
    { id: string; name: string; feature_key: string; type: string }[]
  >([]);

  // Fetch donuts from DB
  useEffect(() => {
    async function fetchDonuts() {
      const res = await fetch('/api/donuts');
      const data = await res.json();
      if (data === null) {
        console.error('Failed to fetch donuts:');
      } else {
        setDonuts(data || []);
      }
    }
    fetchDonuts();
  }, []);

  useEffect(() => {
    async function fetchFeatures() {
      const res = await fetch('/api/features');
      const data = await res.json();

      if (data === null) {
        console.error('Failed to fetch features:');
      } else {
        setAvailableFeatures(data || []);
      }
    }

    fetchFeatures();
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
        : null,
      quantity: quantity ? parseInt(quantity) : null,
      is_featured: type === 'featured',
      is_active: isActive,
      is_discounted: isDiscounted,
      donut_ids: selectedDonuts,
      start_at: startDate === '' ? null : startDate,
      end_at: endDate === '' ? null : endDate,
      color: selectedColor,
    };

    const safeFeatures = Array.isArray(features) ? features : [];

    const res = await fetch('/api/shop', {
      method: 'POST',
      body: JSON.stringify({ productBody, features: safeFeatures }),
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
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={type}
                onChange={(e) => setType(e.target.value as ProductType)}
              >
                <option value={ProductType.Featured}>Featured</option>
                <option value={ProductType.Subscription}>Subscription</option>
                <option value={ProductType.DonutBox}>Donut Box</option>
                <option value={ProductType.Bundle}>Bundle</option>
              </select>
            </div>

            {/* Color Picker */}

            <div className="space-y-2">
              <label className=" block font-medium text-gray-700 mb-2 ">
                Select Product Color <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-8">
                {[
                  'F3C623',
                  '67AE6E',
                  'E9A319',
                  '547792',
                  'C68EFD',
                  'A08963',
                  '4F959D',
                  'FFB8E0',
                  'B6FFA1',
                  '68D2E8',
                ].map((color) => {
                  const hex = `#${color}`;
                  const isSelected = selectedColor === hex;

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-10 h-10 rounded-md border-2 transition-all duration-150 ${
                        isSelected
                          ? 'border-pink-400 scale-110'
                          : 'border-transparent'
                      }`}
                      aria-label={`Select color ${hex}`}
                    />
                  );
                })}
              </div>

              {selectedColor === '' && (
                <p className="text-sm text-red-500 mt-1">Color is required</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">
                Description
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
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
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">
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
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">
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
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">
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

            <div className="space-y-2">
              <label className="block font-bold text-gray-700">
                Select Donuts <span className="text-red-500">*</span>
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

            {/* Features Section */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-700">
                Add Features <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 p-4 border rounded-lg bg-gray-50">
                {availableFeatures.map((feat) => {
                  const isSelected = features.includes(feat.feature_key);
                  return (
                    <label key={feat.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setFeatures((prev) =>
                            isSelected
                              ? prev.filter((f) => f !== feat.feature_key)
                              : [...prev, feat.feature_key]
                          );
                        }}
                      />
                      <span className="text-sm text-gray-700">
                        {feat.name} ({feat.type})
                      </span>
                    </label>
                  );
                })}
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
