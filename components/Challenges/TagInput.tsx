'use client';

import { useState } from 'react';

export default function TagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const handleAddTag = () => {
    const newTag = input.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">Tags</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Enter tag..."
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
        >
          Add
        </button>
      </div>

      {/* Display Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="text-pink-600 hover:text-pink-800"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
