'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Challenge } from '@/types/interfaces/Challenge';
import { ChallengeStatus } from '@/types/enums/ChallengeStatus';
import { ChallengeType } from '@/types/enums/ChallengeType';

export default function EditChallengeForm({
  challenge,
}: {
  challenge: Challenge;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [type, setType] = useState<ChallengeType>(
    challenge.type || ChallengeType.scheduled
  );
  const [title, setTitle] = useState(challenge.title || '');
  const [description, setDescription] = useState(challenge.description || '');
  const [prize, setPrize] = useState(challenge.prize || '');
  const [status, setStatus] = useState<ChallengeStatus>(
    challenge.status || ChallengeStatus.active
  );
  const [startDate, setStartDate] = useState(
    challenge.start_date?.slice(0, 16) || ''
  );
  const [endDate, setEndDate] = useState(
    challenge.end_date?.slice(0, 16) || ''
  );
  const [imageUrl, setImageUrl] = useState(challenge.image_url || '');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const editedChallengeData: Partial<Challenge> = {
      type,
      title,
      description,
      prize,
      status,
      image_url: imageUrl,
      start_date: type === ChallengeType.scheduled ? startDate : null,
      end_date: endDate,
    };

    const res = await fetch(`/api/challenges/${challenge.id}`, {
      method: 'PATCH',
      body: JSON.stringify(editedChallengeData),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/dashboard/challenges');
    } else {
      alert('Update failed');
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        'Are you sure you want to delete this challenge? This action is permanent.'
      )
    )
      return;

    setDeleting(true);

    const res = await fetch(`/api/challenges/${challenge.id}`, {
      method: 'DELETE',
    });

    setDeleting(false);

    if (res.ok) {
      router.push('/dashboard/challenges');
    } else {
      alert('Delete failed');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-8 rounded-md shadow max-w-2xl"
    >
      <h1 className="text-2xl font-bold text-gray-800">Edit Challenge</h1>

      <div>
        <label className="block font-medium text-gray-700">Type</label>
        <select
          className="w-full mt-1 p-2 border rounded"
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
          className="w-full mt-1 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

      <div>
        <label className="block font-medium text-gray-700">Prize</label>
        <input
          className="w-full mt-1 p-2 border rounded"
          value={prize}
          onChange={(e) => setPrize(e.target.value)}
        />
      </div>

      {type === 'scheduled' && (
        <div>
          <label className="block font-medium text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
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
          className="w-full mt-1 p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">Status</label>
        <select
          className="w-full mt-1 p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as ChallengeStatus)}
        >
          <option value={ChallengeStatus.active}>Active</option>
          <option value={ChallengeStatus.completed}>Completed</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow ${
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
          {loading ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow ${
            deleting ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </form>
  );
}
