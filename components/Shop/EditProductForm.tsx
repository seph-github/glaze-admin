"use client";

import { ProductType } from "@/types/enums/ProductType";
import { Donut } from "@/types/interfaces/Donut";
import { Product } from "@/types/interfaces/Product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";
import toast from "react-hot-toast";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [type, setType] = useState<ProductType>(product.type);
  const [price, setPrice] = useState((product.price_cents / 100).toString());
  const [discountPrice, setDiscountPrice] = useState(
    product.discount_price_cents
      ? (product.discount_price_cents / 100).toString()
      : "",
  );
  const [quantity, setQuantity] = useState(product.quantity?.toString() || "0");
  const [isActive, setIsActive] = useState(product.is_active ?? true);
  const [isDiscounted, setIsDiscounted] = useState(
    product.is_discounted ?? false,
  );
  const [features, setFeatures] = useState<string[]>([]);
  const [donuts, setDonuts] = useState<Donut[]>([]);
  const [selectedDonuts, setSelectedDonuts] = useState<string[]>(
    product.donut_ids ?? [],
  );
  const [startDate, setStartDate] = useState(product.start_at || null);
  const [endDate, setEndDate] = useState(product.end_at || null);
  const [selectedColor, setSelectedColor] = useState(product.color);
  const [availableFeatures, setAvailableFeatures] = useState<
    { id: string; name: string; feature_key: string; type: string }[]
  >([]);

  useEffect(() => {
    async function fetchDonuts() {
      const { data, error } = await supabase.from("donuts").select("*");
      if (error) {
        console.error("Failed to fetch donuts:", error);
      } else {
        setDonuts(data || []);
      }
    }
    fetchDonuts();
  }, []);

  useEffect(() => {
    async function fetchFeatures() {
      const { data, error } = await supabase
        .from("features")
        .select("id, name, feature_key, type")
        .eq("is_active", true)
        .in("type", ["purchase", "subscription"]);

      if (error) {
        console.error("Failed to fetch features:", error);
      } else {
        setAvailableFeatures(data || []);
      }
    }

    fetchFeatures();
  }, []);

  useEffect(() => {
    async function fetchLinkedFeatures() {
      const { data, error } = await supabase
        .from("shop_product_features")
        .select("feature_id, features:feature_id (feature_key)")
        .eq("shop_product_id", product.id);

      if (error) {
        console.error("Failed to fetch linked features:", error);
      } else {
        const featureKeys =
          data
            ?.map((row) => {
              const feature = Array.isArray(row.features)
                ? row.features[0]
                : row.features;

              return feature?.feature_key ?? null;
            })
            .filter(Boolean) ?? [];
        setFeatures(featureKeys);
      }
    }

    fetchLinkedFeatures();
  }, [product.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedColor) {
      toast.error("Please select a product color.");
      return;
    }

    if (selectedDonuts.length === 0) {
      toast.error("Please select at least one donut.");
      return;
    }

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
      is_active: isActive,
      is_discounted: isDiscounted,
      donut_ids: selectedDonuts,
      start_at: startDate ?? null,
      end_at: endDate,
      color: selectedColor,
    };

    const res = await fetch(`/api/shop/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(productBody),
    });

    setLoading(false);
    if (res.ok) {
      router.push("/dashboard/shop");
    } else {
      alert("Update failed.");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);

    const res = await fetch(`/api/shop/${product.id}`, {
      method: "DELETE",
    });

    setDeleting(false);
    if (res.ok) {
      router.push("/dashboard/shop");
    } else {
      alert("Delete failed.");
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6 bg-white p-8 rounded-xl shadow-md border">
            {/* Product type */}
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
                <option value={ProductType.Subscriptions}>Subscription</option>
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
                  "F3C623",
                  "67AE6E",
                  "E9A319",
                  "547792",
                  "C68EFD",
                  "A08963",
                  "4F959D",
                  "FFB8E0",
                  "B6FFA1",
                  "68D2E8",
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
                          ? "border-pink-400 scale-110"
                          : "border-transparent"
                      }`}
                      aria-label={`Select color ${hex}`}
                    />
                  );
                })}
              </div>

              {selectedColor === "" && (
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
            {(type === "donut_box" || type === "bundle") && (
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
            {type === "featured" && (
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                    value={startDate ?? ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-bold text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                    value={endDate ?? ""}
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
                      setSelectedDonuts((prev = []) =>
                        prev.includes(donut.id)
                          ? prev.filter((id) => id !== donut.id)
                          : [...prev, donut.id],
                      );
                    }}
                    className={`flex flex-col items-center gap-2 p-3 border rounded-lg text-xs transition duration-200 ${
                      selectedDonuts?.includes(donut.id)
                        ? "bg-pink-100 border-pink-400 scale-105"
                        : "hover:bg-gray-100"
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
                              : [...prev, feat.feature_key],
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
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </div>
  );
}
