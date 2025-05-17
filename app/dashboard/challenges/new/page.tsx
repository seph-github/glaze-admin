'use client';

import { useEffect, useState } from 'react';
import { ChallengeStatus } from '@/types/enums/ChallengeStatus';
import { ChallengeType } from '@/types/enums/ChallengeType';
import { Challenge } from '@/types/interfaces/Challenge';
import VideoSelectionModal from '@/components/Challenges/VideoSelectionModal';
import { VideoContent } from '@/types/interfaces/VideoContent';
import { Category } from '@/types/interfaces/Categories';
import MultiInput from '@/components/Challenges/MultiInput';
import { useRouter } from 'next/navigation';

export default function NewChallengePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<ChallengeType>(ChallengeType.scheduled);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [prize, setPrize] = useState('');
  const [status, setStatus] = useState<ChallengeStatus>(ChallengeStatus.active);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [rules, setRules] = useState<string[]>([]);

  const handleVideoSelect = (video: VideoContent) => {
    setSelectedVideo(video);
  };

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
      challenge_video_id: selectedVideo!.id,
      category: selectedCategory,
      tags,
      rules,
    };

    console.log(challengeData);

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

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data === null) {
        console.error('Failed to fetch categories:');
      }
      setCategories(data);
    }

    fetchCategories();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create New Challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={type}
            onChange={(e) => setType(e.target.value as ChallengeType)}
          >
            <option value={ChallengeType.scheduled}>Scheduled</option>
            <option value={ChallengeType.live}>Live</option>
          </select>
        </div>

        {/* Select Challenge Video */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 mb-2">
            Challenge Video <span className="text-red-500">*</span>
          </label>

          {selectedVideo ? (
            <div className="flex items-center justify-between p-3 border rounded bg-gray-50">
              <span>{selectedVideo.title}</span>
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="text-sm text-pink-600 hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-2 px-4 rounded"
            >
              Select Challenge Video <span className="text-red-500">*</span>
            </button>
          )}
        </div>

        {/* -- Tags -- */}
        <MultiInput label={'Tags'} values={tags} setValues={setTags} />

        {/* -- Rules -- */}
        <MultiInput label={'Rules'} values={rules} setValues={setRules} />

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={selectedCategory ?? ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select a Category --</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <VideoSelectionModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          onSelect={handleVideoSelect}
        />

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Prize <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
            required
          />
        </div>

        {type === 'scheduled' && (
          <div className="space-y-2">
            <label className="block font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
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

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            End Date <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
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
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Challenge...' : 'Create Challenge'}
        </button>
      </form>
    </div>
  );
}
