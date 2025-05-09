'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function NewDonutPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!imageFile) {
      alert('Please upload an image');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('is_default', isDefault.toString());
    formData.append('image', imageFile);

    const res = await fetch('/api/shop/donuts', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard/shop/donuts');
    } else {
      const errorData = await res.json();
      alert(errorData.error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-10 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-pink-600">
        Create New Donut 🍩
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Donut Name
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Donut Image
          </label>
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-all hover:border-pink-400 hover:bg-gray-50 cursor-pointer"
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview"
                width={150}
                height={150}
                className="object-cover rounded-lg mb-2 shadow-md"
              />
            ) : (
              <>
                <p className="text-gray-600">
                  Drag and drop your donut image here
                </p>
                <p className="text-gray-400 text-sm mt-1">or click below</p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              required
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {imagePreview ? 'Change Image' : 'Select Image'}
            </label>
          </div>
        </div>

        {/* Is Default Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is-default"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="is-default" className="text-gray-700">
            Mark as Default Donut
          </label>
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
