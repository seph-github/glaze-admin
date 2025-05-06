'use client';

import { useRouter } from 'next/navigation';

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        onClick={() => router.push('/dashboard/challenges/new')}
        className="bg-blue-500 text-white p-4 rounded shadow"
      >
        New Challenge
      </button>
      <button
        onClick={() => router.push('/dashboard/shop')}
        className="bg-pink-500 text-white p-4 rounded shadow"
      >
        Manage Shop
      </button>
      <button
        onClick={() => router.push('/dashboard/moderation')}
        className="bg-yellow-500 text-white p-4 rounded shadow"
      >
        Review Flags
      </button>
      <button
        onClick={() => router.push('/dashboard/recruiters')}
        className="bg-green-500 text-white p-4 rounded shadow"
      >
        Recruiters
      </button>
    </div>
  );
}
