'use client';

import { useState } from 'react';

export default function MultiInput({
  label,
  values,
  setValues,
}: {
  label: string;
  values: string[];
  setValues: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const handleAddValue = () => {
    const newValue = input.trim();
    if (newValue && !values.includes(newValue)) {
      setValues([...values, newValue]);
      setInput('');
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    setValues(values.filter((value) => value !== valueToRemove));
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium text-gray-700">{label}</label>

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
          onClick={handleAddValue}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
        >
          Add
        </button>
      </div>

      {/* Display Value */}
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={index}
            className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {value}
            <button
              type="button"
              onClick={() => handleRemoveValue(value)}
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
