'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChallengeStatus } from '@/types/enums/ChallengeStatus';
import { ChallengeType } from '@/types/enums/ChallengeType';
import { Challenge } from '@/types/interfaces/Challenge';

export default function NewChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ChallengeType>(ChallengeType.scheduled);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [status, setStatus] = useState<ChallengeStatus>(ChallengeStatus.active);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const challengeData: Partial<Challenge> = {
      type,
      title,
      description,
      prize,
      status,
      image_url: imageUrl,
      start_date: type === ChallengeType.scheduled ? startDate : null,
      end_date: endDate,
    };

    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(challengeData),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard/challenges');
    } else {
      alert('Error creating challenge');
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create New Challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700">Type</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={type}
            onChange={(e) => setType(e.target.value as ChallengeType)}
          >
            <option value={ChallengeType.scheduled}>Scheduled</option>
            <option value={ChallengeType.live}>Live</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Prize</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
          />
        </div>

        {type === 'scheduled' && (
          <div>
            <label className="block font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block font-medium text-gray-700">End Date</label>
          <input
            type="datetime-local"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* <div>
          <label className="block font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div> */}

        <div>
          <label className="block font-medium text-gray-700">Status</label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={status}
            onChange={(e) => setStatus(e.target.value as ChallengeStatus)}
          >
            <option value={ChallengeStatus.active}>Active</option>
            <option value={ChallengeStatus.completed}>Completed</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading && (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {loading ? 'Creating...' : 'Create Challenge'}
        </button>
      </form>
    </div>
  );
}
