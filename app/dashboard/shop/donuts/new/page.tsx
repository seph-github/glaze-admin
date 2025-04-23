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

    console.log('FormData:', formData);

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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Add New Donut</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full mt-1 p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* <div>
          <label className="block font-medium text-gray-700">Donut Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImageFile(file);
            }}
            required
          />
        </div> */}

        <div>
          <label className="block font-medium text-gray-700">Donut Image</label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
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
            <p className="text-sm text-gray-600">
              Drag & drop an image here or click below to upload
            </p>
            <input
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              required
            />
            {imagePreview && (
              <Image
                src={imagePreview || ''}
                alt="Preview"
                width={128}
                height={128}
                className="mt-4 w-32 h-32 object-cover rounded-lg mx-auto"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <label className="text-sm text-gray-700">
              Mark as Default Donut
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded shadow ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Donut'}
        </button>
      </form>
    </div>
  );
}
